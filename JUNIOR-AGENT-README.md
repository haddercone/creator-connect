Junior Developer Agent

This minimal agent is implemented as a GitHub Actions workflow + script.

How it works:
- Trigger: add the label `junior-agent` to an issue or mention `@junior-dev-bot` in an issue comment.
- The action posts an acknowledging comment, creates a branch `junior/issue-<number>/start`, commits an initial plan file under `work/`, pushes the branch, and opens a WIP PR.

Notes and next steps:
- This is an MVP. To make the agent "work" like a junior developer (e.g., edit code, open iterative PRs, run tests, use an LLM to propose code), we can extend the script to run automated edits, call a hosted LLM, or wire in a GitHub App with finer permissions.
- The workflow uses the automatic `GITHUB_TOKEN`. Ensure your repository's Actions settings allow workflows to create and push branches.