"""GitHub REST API helpers for the Junior Agent.

Thin stdlib-only wrapper over the GitHub REST API. Keeps the zero-dependency
convention of the original junior-agent.py.
"""
import json
import os
import ssl
import urllib.error
import urllib.parse
import urllib.request

GITHUB_API = "https://api.github.com"
USER_AGENT = "junior-agent-bot"


class GitHubClient:
    def __init__(self, token: str, repo: str):
        self.token = token
        self.owner, self.repo_name = repo.split("/", 1)

    # ---- low-level -------------------------------------------------------
    def request(self, method: str, path: str, data: dict | None = None):
        url = GITHUB_API + path
        headers = {
            "Accept": "application/vnd.github+json",
            "User-Agent": USER_AGENT,
            "Authorization": f"token {self.token}",
        }
        body = None
        if data is not None:
            body = json.dumps(data).encode("utf-8")
            headers["Content-Type"] = "application/json"
        req = urllib.request.Request(url, data=body, headers=headers, method=method)
        ctx = ssl.create_default_context()
        try:
            with urllib.request.urlopen(req, context=ctx, timeout=120) as resp:
                raw = resp.read().decode("utf-8")
                return json.loads(raw) if raw else None
        except urllib.error.HTTPError as e:
            print("API error", e.code, e.read().decode(), flush=True)
            raise

    def paginate(self, path: str) -> list:
        out = []
        page = 1
        while True:
            sep = "&" if "?" in path else "?"
            data = self.request("GET", f"{path}{sep}per_page=100&page={page}")
            out.extend(data or [])
            if not data or len(data) < 100:
                break
            page += 1
        return out

    def api_path(self, suffix: str) -> str:
        return f"/repos/{self.owner}/{self.repo_name}{suffix}"

    # ---- issue / comment ------------------------------------------------
    def get_issue(self, number: int) -> dict:
        return self.request("GET", f"/repos/{self.owner}/{self.repo_name}/issues/{number}")

    def get_issue_comments(self, number: int) -> list:
        return self.paginate(
            f"/repos/{self.owner}/{self.repo_name}/issues/{number}/comments"
        )

    def post_comment(self, number: int, body: str) -> dict:
        return self.request(
            "POST",
            f"/repos/{self.owner}/{self.repo_name}/issues/{number}/comments",
            {"body": body},
        )

    # ---- repository ------------------------------------------------------
    def get_default_branch(self) -> str:
        info = self.request("GET", f"/repos/{self.owner}/{self.repo_name}")
        return info.get("default_branch", "main")

    def file_contents(self, path: str, ref: str | None = None) -> dict | None:
        q = f"?ref={urllib.parse.quote(ref)}" if ref else ""
        try:
            return self.request(
                "GET",
                f"/repos/{self.owner}/{self.repo_name}/contents/{urllib.parse.quote(path)}{q}",
            )
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return None
            raise

    # ---- pull requests ---------------------------------------------------
    def get_open_prs_for_branch(self, branch: str) -> list:
        return self.paginate(
            f"/repos/{self.owner}/{self.repo_name}/pulls?state=open&head="
            + urllib.parse.quote(f"{self.owner}:{branch}")
        )

    def create_pr(self, title: str, head: str, base: str, body: str, draft: bool = False) -> dict:
        return self.request(
            "POST",
            f"/repos/{self.owner}/{self.repo_name}/pulls",
            {
                "title": title,
                "head": head,
                "base": base,
                "body": body,
                "draft": draft,
            },
        )

    def update_pr(self, pr_number: int, **fields) -> dict:
        return self.request(
            "PATCH", f"/repos/{self.owner}/{self.repo_name}/pulls/{pr_number}", fields
        )

    def get_pr(self, number: int) -> dict:
        return self.request("GET", f"/repos/{self.owner}/{self.repo_name}/pulls/{number}")
