"""Prompt assembly: issue + repo context -> compact agent prompt.

Local models have a finite, relatively small context window, and this repo pays
per token on the remote box. Keep the assembled prompt tight: fetch only the
highest-signal files and trim them to a bounded size.
"""
import os

# Key files whose content gives the model the most repo understanding for a
# Next.js/Prisma app (schema, shared types, rate limiting, an action file).
PRIORITY_FILES = [
    "prisma/schema.prisma",
    "src/config/rateLimit.ts",
    "src/lib/types.ts",
    "src/app/actions/actions.ts",
    "README.md",
    "CONTROLS.md",
]

MAX_FILE_CHARS = 6000
MAX_CONTEXT_CHARS = 22000


def _trim(text: str, limit: int) -> str:
    if len(text) <= limit:
        return text
    return text[:limit] + "\n... [truncated]"


def build_messages(
    issue: dict,
    comments: list[dict],
    file_context: list[tuple[str, str]],
    system_extra: str,
) -> list[dict]:
    """Build the chat messages for the model.

    Args:
        issue: GitHub issue object.
        comments: list of comment dicts (strings only needed).
        file_context: list of (path, content) tuples already read & trimmed.
        system_extra: extra system guidance (repo commands etc.).
    """
    system = (
        "You are the Junior Agent, a careful software engineer working autonomously on "
        "a GitHub issue. You produce structured output that a driver loop applies.\n\n"
        "Rules:\n"
        "- Work only within the scope of the issue. Do not refactor unrelated code.\n"
        "- Prefer the smallest correct change.\n"
        "- Follow the repository's existing conventions and design system exactly.\n"
        "- Never invent dependencies or change auth/rate-limiting semantics.\n"
        f"{system_extra}\n"
    )

    issue_body = issue.get("body") or ""
    labels = ", ".join(l.get("name", "") for l in issue.get("labels", []))
    user_prompt = [
        f"# Issue #{issue.get('number')}: {issue.get('title')}",
        f"Labels: {labels or 'none'}",
        "",
        "## Issue body",
        _trim(issue_body, 8000),
    ]

    if comments:
        user_prompt.append("\n## Issue comments")
        for c in comments[-8:]:
            author = c.get("user", {}).get("login", "unknown")
            body = _trim(c.get("body") or "", 1500)
            user_prompt.append(f"\n### {author}:\n{body}")

    if file_context:
        user_prompt.append("\n## Relevant repository files")
        budget = MAX_CONTEXT_CHARS
        for path, content in file_context:
            if budget <= 0:
                break
            piece = _trim(content, min(MAX_FILE_CHARS, budget))
            budget -= len(piece)
            user_prompt.append(f"\n### {path}\n```\n{piece}\n```")

    user_prompt.append(
        "\n## Your task\n"
        "1. Reproduce/understand the issue.\n"
        "2. Produce a concrete plan.\n"
        "3. Output EXACTLY one JSON object, nothing else, in this shape:\n"
        "```json\n"
        "{\n"
        '  "plan": ["step1", "step2", ...],\n'
        '  "files": [{"path": "src/...", "action": "create|modify|delete",\n'
        '             "old_snippet": "exact existing line(s) to match, or \\"\\" for create",\n'
        '             "new_snippet": "replacement content for create/modify"}],\n'
        '  "summary": "one-line description for the PR"\n'
        "}\n"
        "```\n"
        "For modify actions, old_snippet must match the file's current content exactly "
        "searchString-style, and new_snippet replaces it. Keep new_snippet complete "
        "and valid on its own."
    )

    return [
        {"role": "system", "content": system},
        {"role": "user", "content": "\n".join(user_prompt)},
    ]
