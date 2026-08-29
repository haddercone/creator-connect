"""Ollama client for the Junior Agent.

Talks to the remote self-hosted Ollama endpoint over HTTPS. The endpoint is
fronted by nginx (see .github/infra/) which requires every request to carry the
shared API key in the Authorization header.
"""
import json
import ssl
import time
import urllib.error
import urllib.request


class ModelError(Exception):
    pass


def chat(
    base_url: str,
    api_key: str,
    model: str,
    messages: list[dict],
    *,
    max_tokens: int = 4096,
    timeout: int = 900,
    attempts: int = 3,
) -> str:
    """Send a chat completion and return the assistant text.

    base_url is the remote endpoint root, e.g. https://<box>/ (server_name root,
    which proxies /api/chat). We append /api/chat.
    """
    url = base_url.rstrip("/") + "/api/chat"
    payload = {
        "model": model,
        "messages": messages,
        "stream": False,
        "options": {"num_predict": max_tokens},
    }
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
    }
    body = json.dumps(payload).encode("utf-8")
    ctx = ssl.create_default_context()

    last_err = None
    for attempt in range(1, attempts + 1):
        try:
            req = urllib.request.Request(url, data=body, headers=headers, method="POST")
            with urllib.request.urlopen(req, context=ctx, timeout=timeout) as resp:
                data = json.loads(resp.read().decode("utf-8"))
            return data.get("message", {}).get("content", "").strip()
        except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError) as e:
            last_err = e
            print(f"Model call failed (attempt {attempt}/{attempts}): {e}", flush=True)
            if attempt < attempts:
                time.sleep(2 * attempt)
    raise ModelError(str(last_err))
