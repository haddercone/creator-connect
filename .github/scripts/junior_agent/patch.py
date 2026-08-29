"""Apply model-proposed file edits to the worktree and commit them.

The model returns {files: [{path, action, old_snippet, new_snippet}]}. For
modify/delete we require old_snippet to match existing content exactly so we don't
silently corrupt the tree; any mismatch is reported back for a retry.
"""
import os
import subprocess


def read_file(path: str) -> str:
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def write_file(path: str, content: str) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)


def apply_edits(edits: list[dict], check_commands: list[list[str]]) -> list[str]:
    """Apply edits; return a list of human-readable results/errors.

    If any edit fails to apply cleanly we do NOT commit and the caller feeds the
    errors back to the model for a retry.
    """
    results: list[str] = []
    for edit in edits:
        path = str(edit.get("path", "")).lstrip("/")
        action = edit.get("action", "modify")
        old = edit.get("old_snippet") or ""
        new = edit.get("new_snippet") or ""
        results.append(f"{action} {path}")

        if action == "delete":
            if not os.path.exists(path):
                results.append(f"  !! {path} not found")
                continue
            content = read_file(path)
            if old and old not in content:
                results.append(f"  !! delete old_snippet not found in {path}")
                continue
            if old:
                content = content.replace(old, "", 1)
            write_file(path, content)
        elif action == "create":
            if os.path.exists(path) and old:
                content = read_file(path)
                if old not in content:
                    results.append(f"  !! create: expected content not found in {path}")
                    continue
                content = content.replace(old, new, 1)
                write_file(path, content)
            else:
                write_file(path, new)
        else:  # modify
            if not os.path.exists(path):
                results.append(f"  !! modify: {path} missing")
                continue
            content = read_file(path)
            if old not in content:
                results.append(f"  !! modify: old_snippet not found in {path}")
                continue
            content = content.replace(old, new, 1)
            write_file(path, content)

    # Run repo-level checks (lint/build) - failures collected, tree left dirty.
    for cmd in check_commands:
        proc = subprocess.run(cmd, capture_output=True, text=True)
        status = "ok" if proc.returncode == 0 else "FAILED"
        results.append(f"check: {' '.join(cmd)} -> {status}")
        if proc.returncode != 0:
            tail = (proc.stdout + proc.stderr).strip().splitlines()[-25:]
            results.append("  output:")
            for line in tail:
                results.append("    " + line)
    return results


def git(*args: str) -> subprocess.CompletedProcess:
    return subprocess.run(["git", *args], capture_output=True, text=True)


def commit_all(message: str) -> None:
    def run(cmd: list[str]) -> None:
        subprocess.run(cmd, check=True, capture_output=True)

    run(["git", "config", "user.name", "junior-agent-bot"])
    run(["git", "config", "user.email", "junior@local"])
    run(["git", "add", "-A"])
    run(["git", "commit", "-m", message])


def push_branch(branch: str, owner_repo: str, token: str) -> None:
    push_url = f"https://x-access-token:{token}@github.com/{owner_repo}.git"
    # Delete any stale copy of this bot branch first (idempotent re-runs).
    subprocess.run(["git", "push", push_url, "--delete", f"refs/heads/{branch}"], capture_output=True)
    subprocess.run(["git", "push", push_url, f"HEAD:refs/heads/{branch}"], check=True, capture_output=True)
