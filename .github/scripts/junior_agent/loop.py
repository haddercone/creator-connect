"""Agent loop: plan -> edit -> verify -> iterate -> open (ready) PR.

Reads the issue, assembles repo context, asks the local model for a plan +
edits, applies them, runs the repo's checks (lint/build), and iterates on
failures. When all checks pass it opens a ready-to-merge PR; otherwise it
marks the PR as draft/WIP and comments the outstanding failures.
"""
import json
import os

from . import github, model, patch, prompt

MAX_ATTEMPTS = 3


def _read_context_files(g: github.GitHubClient, ref: str | None) -> list[tuple[str, str]]:
    context: list[tuple[str, str]] = []
    for path in prompt.PRIORITY_FILES:
        data = g.file_contents(path, ref=ref)
        if data is None:
            continue
        try:
            import base64

            content = base64.b64decode(data.get("content", "")).decode("utf-8", "replace")
        except Exception:
            continue
        context.append((path, content))
        if sum(len(c) for _, c in context) >= prompt.MAX_CONTEXT_CHARS:
            break
    return context


def _parse_json(text: str) -> dict | None:
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end <= start:
        return None
    try:
        return json.loads(text[start : end + 1])
    except json.JSONDecodeError:
        return None


def run(
    *,
    issue_number: int,
    trigger_reason: str,
    base_url: str,
    api_key: str,
    model_tag: str,
    g: github.GitHubClient,
    branch: str,
    check_commands: list[list[str]],
    open_ready: bool,
) -> None:
    issue = g.get_issue(issue_number)
    comments = g.get_issue_comments(issue_number)
    file_context = _read_context_files(g, ref=None)

    system_extra = (
        "This repo's build gate is: `npm run lint` then `npm run build`. "
        "Prefer the smallest correct change that keeps those green."
    )

    messages = prompt.build_messages(issue, comments, file_context, system_extra)
    g.post_comment(
        issue_number,
        f"Junior Agent: investigating `#{issue_number}` and drafting a plan "
        f"(`{trigger_reason}`). I'll iterate until `npm run lint` and `npm run build` pass.",
    )

    # ---- planning + editing loop ----------------------------------------
    last_summary = ""
    for attempt in range(1, MAX_ATTEMPTS + 1):
        print(f"== attempt {attempt}/{MAX_ATTEMPTS} ==", flush=True)
        text = model.chat(base_url, api_key, model_tag, messages, max_tokens=6000)
        parsed = _parse_json(text)
        if not parsed:
            g.post_comment(issue_number, f"Junior Agent: could not parse model output on attempt {attempt}.")
            messages = messages + [
                {"role": "assistant", "content": text},
                {"role": "user", "content": "Your output was not valid JSON with the required shape. Return only the JSON object."},
            ]
            continue

        last_summary = parsed.get("summary", "")
        edits = parsed.get("files", [])
        if not edits:
            g.post_comment(issue_number, "Junior Agent: the model proposed no file edits; stopping.")
            return

        results = patch.apply_edits(edits, check_commands)
        failed = [r for r in results if r.startswith("  !!") or "FAILED" in r]

        patch.commit_all(f"jr-agent(#{issue_number}): {last_summary or 'apply model edits'}")

        # Push stand-in branch so a PR can be opened and updated on each attempt.
        g.post_comment(issue_number, "Junior Agent: pushing intermediate branch and opening/updating the WIP PR.")
        owner, repo_name = g.owner, g.repo_name
        patch.push_branch(branch, f"{owner}/{repo_name}", g.token)

        default_branch = g.get_default_branch()
        existing = g.get_open_prs_for_branch(branch)
        matching = [pr for pr in existing if pr.get("head", {}).get("ref") == branch]
        if matching:
            pr = g.update_pr(matching[0]["number"], body=f"WIP (attempt {attempt}).\n\n```\n{chr(10).join(results)}\n```")
            pr_number = pr["number"]
        else:
            pr = g.create_pr(
                title=f"WIP: #{issue_number} — {last_summary or 'junior agent work'}",
                head=branch,
                base=default_branch,
                body=(f"Draft changes for issue #{issue_number} applied by the Junior Agent.\n\n"
                      f"```\n{chr(10).join(results)}\n```"),
                draft=True,
            )
            pr_number = pr["number"]

        if not failed:
            g.update_pr(pr_number, state="open", draft=not open_ready)
            title = f"{'' if open_ready else 'WIP: '}#{issue_number} — {last_summary}"
            g.update_pr(pr_number, title=title)
            body = (
                f"Ready for review: resolves #{issue_number}.\n\n"
                f"**Summary:** {last_summary}\n\n"
                f"**Plan applied:**\n" + "".join(f"- {s}\n" for s in parsed.get("plan", [])) +
                "\n**Verification:**\n```\n" + "\n".join(results) + "\n```"
            )
            if open_ready:
                pr = g.update_pr(pr_number, body=body)
            measurements = g.post_comment(issue_number, f"Junior Agent: changes are green ({branch}). PR: {pr.get('html_url', pr_number)}")
            _ = measurements
            return

        # ---- had failures: feed them back and retry ---------------------
        feedback = "\n".join(results)
        messages = messages + [
            {"role": "assistant", "content": text},
            {
                "role": "user",
                "content": (
                    "The applied edits did not verify. Here is the check output:\n"
                    f"```\n{feedback}\n```\n"
                    "Fix the failing files. Return ONLY a fresh JSON object with further "
                    "edits (modify the files to correct them)."
                ),
            },
        ]
        g.update_pr(pr_number, body=f"WIP (attempt {attempt} failed, retrying).\n\n```\n{feedback}\n```")

    # ---- exhausted attempts ---------------------------------------------
    g.post_comment(
        issue_number,
        f"Junior Agent: exhausted {MAX_ATTEMPTS} attempts without green checks. "
        "The PR is left as a draft for a human to continue.",
    )
