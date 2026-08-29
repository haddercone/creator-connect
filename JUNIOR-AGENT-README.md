Junior Developer Agent

A self-hosted software agent that takes a GitHub issue and turns it into a
review-ready pull request. The agent edits code, runs the repo's real checks
(`npm run lint` + `npm run build`) in a GitHub Actions loop, iterates on
failures, and opens a ready-to-merge PR when green.

Constraints honored:
- No GitHub Copilot agent / Copilot Workspace / cloud code agent.
- The reasoning model is **self-hosted Ollama** on a rented GPU box, reached
  over HTTPS by GitHub-hosted runners. Nothing about the model is cloud-managed.

## How it works

1. **Trigger**: add the label `junior-agent` to an issue, or mention
   `@junior-dev-bot` in an issue comment.
2. The workflow posts an acknowledging comment, creates branch
   `junior/issue-<number>/start`, and asks the local model for a plan + file edits.
3. Edits are applied on the branch and committed. `npm run lint` and
   `npm run build` run after each attempt.
4. If checks fail, the failure output is fed back to the model and it retries
   (up to 3 attempts).
5. When checks pass, a **ready-to-merge PR** is opened/updated. If attempts are
   exhausted, the PR stays a draft with the failures reported.

## Model host (self-hosted Ollama)

The reasoning model lives on a rented GPU box you control. See
`.github/infra/`:
- `Modelfile` — model + a large `num_ctx` (critical for agent loops).
- `serve.sh` — start Ollama (localhost only) and build the `junior-agent` tag.
- `nginx.conf` / `setup.sh` — reverse proxy with **HTTPS + API-key header auth**
  + rate limiting. **Do not** expose port 11434 directly; Ollama has no built-in
  auth and open instances are actively exploited.

Model size by VRAM: `qwen3-coder:30b` (>=24GB), `qwen3-coder:14b`/`devstral-small`
(16-24GB), `qwen3:8b` (<=16GB, minimal).

## GitHub required secrets / variables

- `OLLAMA_API_URL` (secret) — e.g. `https://<your-box>/`
- `OLLAMA_API_KEY` (secret) — shared secret checked by nginx (Bearer).
- `OLLAMA_MODEL` (secret) — default `junior-agent`.
- `OPEN_READY_PR` (variable) — `true` opens ready-to-merge PRs, `false` keeps them
  as drafts (safety switch). Default in the code is `true`.

The workflow uses the automatic `GITHUB_TOKEN`. Ensure repository Actions
settings allow workflows to create and push branches.