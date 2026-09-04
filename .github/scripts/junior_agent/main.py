#!/usr/bin/env python3
"""Entrypoint for the Junior Agent.

Triggered from .github/workflows/junior-agent.yml. Detects the trigger (a
@junior-dev-bot mention or the 'junior-agent' label), then runs the
plan -> edit -> verify loop.
"""
import json
import os
import sys

from . import loop
from .github import GitHubClient

BOT_MENTION = "@junior-dev-bot"
LABEL = "junior-agent"


def read_event(path: str) -> dict:
    with open(path, "r") as f:
        return json.load(f)


def detect_trigger(event: dict, event_name: str) -> tuple[bool, str]:
    issue = event.get("issue") or event.get("pull_request")
    triggered = False
    reason = None

    comment = event.get("comment")
    if comment and isinstance(comment, dict):
        if BOT_MENTION in (comment.get("body") or ""):
            triggered, reason = True, "mention in comment"

    if not triggered and issue and BOT_MENTION in (issue.get("body") or ""):
        triggered, reason = True, "mention in issue body"

    if not triggered and event.get("label"):
        if (event["label"].get("name") or "").lower() == LABEL:
            triggered, reason = True, "label 'junior-agent'"

    if event_name == "issues" and event.get("action") == "closed":
        triggered, reason = False, "issue closed"

    return triggered, reason


def main() -> None:
    event_path = os.environ.get("GITHUB_EVENT_PATH")
    token = os.environ.get("GITHUB_TOKEN")
    repo = os.environ.get("GITHUB_REPOSITORY")
    if not (event_path and token and repo):
        print("Missing GITHUB_EVENT_PATH / GITHUB_TOKEN / GITHUB_REPOSITORY")
        sys.exit(1)

    event = read_event(event_path)
    event_name = os.environ.get("GITHUB_EVENT_NAME", "")

    triggered, reason = detect_trigger(event, event_name)
    issue = event.get("issue") or event.get("pull_request")
    issue_number = issue.get("number") if issue else None
    if not triggered or not issue_number:
        print(f"No trigger ({reason}); exiting.")
        return

    base_url = os.environ.get("OLLAMA_API_URL", "").rstrip("/")
    api_key = os.environ.get("OLLAMA_API_KEY", "")
    model_tag = os.environ.get("OLLAMA_MODEL", "junior-agent")
    open_ready = os.environ.get("OPEN_READY_PR", "true").lower() == "true"
    if not (base_url and api_key):
        print("Missing OLLAMA_API_URL / OLLAMA_API_KEY")
        sys.exit(1)

    branch = f"junior/issue-{issue_number}/start"
    g = GitHubClient(token, repo)

    loop.run(
        issue_number=issue_number,
        trigger_reason=reason or "unknown",
        base_url=base_url,
        api_key=api_key,
        model_tag=model_tag,
        g=g,
        branch=branch,
        check_commands=[["npm", "run", "lint"], ["npm", "run", "build"]],
        open_ready=open_ready,
    )


if __name__ == "__main__":
    main()
