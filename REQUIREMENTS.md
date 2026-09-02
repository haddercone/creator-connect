## New Automated AI Agent to Work with This Repository

### Overview

We need to build an AI agent that will help us build new features for this application as we raise issues. The agent should automatically work on issues when tagged in a GitHub issue.

### Implementation Options

**Option 1 (Preferred - Free):** Create a separate repository containing the agent configuration and code. Implement a GitHub App with access to:
- Read the contents of this repository
- Raise PRs to this repository
- Read issues

**Option 2 (Backup - Paid):** Use GitHub Cloud Agent

### Agent Workflow

1. Create an issue and tag the GitHub App in the issue
2. The GitHub App triggers the agent
3. The agent reads and analyzes the issue
4. The agent works on implementing the solution
5. The agent creates a Pull Request
6. The agent posts the PR to a Discord channel for human review

### Agent Responsibilities

- **Read issues:** Understand the requirements and context from GitHub issues
- **Create PRs:** Implement solutions and raise Pull Requests to this repository
- **Code review (Optional):** Run automated code review on its own PRs (low priority for now)
- **Discord notification:** Post PR links to a Discord channel to notify users for human review

### Infrastructure

- **LLM Hosting:** NVIDIA Cloud for hosting the LLM that will consume context and interact with the agent
- **Agent Hosting:** Separate repository with GitHub App integration

### Technical Requirements — Option 1 (GitHub App Agent)

#### Components to Implement

1. **Separate Agent Repository**
   - New repository housing the agent code, configuration, and deployment setup
   - Language/framework: language-agnostic webhook server (Node.js/Python) with async job runner
   - Webhook endpoint to receive GitHub events (issues, issue comments)
   - Job queue/worker to handle PR creation, LLM calls, and Discord notifications asynchronously

2. **GitHub App**
   - Register as a GitHub App (free, allows installing on the main repo)
   - Webhook events: `issues`, `issue_comment`
   - Permissions required:
     - **Contents:** Read & write (to create PRs, read repo files)
     - **Issues:** Read & write (to read issues, comment/respond)
     - **Pull requests:** Read & write (to open PRs)
   - Configuration: `Permissions` (Repository: Contents, Issues, Pull requests), `Webhooks` (active, URL to agent server)
   - Private key generation for app authentication (used by the agent to generate installation tokens)
   - Install the App on the `creator-connect` repository (and the agent repo if needed)

3. **Trigger & Authentication Flow**
   - Agent detects the App being tagged/mentioned in an issue comment or issue body
   - Exchange App credentials (App ID + private key) for an installation access token
   - Use the token with GitHub REST API to read issue content and repo state
   - React to tagging via a GitHub webhook (`issue_comment` with `@app-name` in body)

4. **LLM Integration (NVIDIA Cloud)**
   - NVIDIA Cloud (NIM / NVIDIA NIM on the cloud, or an inference endpoint) hosting the LLM
   - Provide an OpenAI-compatible API endpoint + API key to the agent
   - Agent formats issue context + repo context and sends prompts to the LLM
   - LLM returns solution/plan; agent applies changes and commits
   - Configuration: `NVIDIA_API_KEY`, `NVIDIA_BASE_URL`, `LLM_MODEL` in environment config

5. **PR Creation**
   - Agent creates a branch, makes commits, and opens a PR against the `creator-connect` repo
   - PR includes a detailed description mapping back to the issue (fixes #issue-number)
   - Uses the installation token for git operations

6. **Discord Notification**
   - Discord webhook pointed at a dedicated channel (e.g., `#pr-reviews`)
   - Message includes PR link, title, summary, and issue reference
   - Sent on every completed PR to notify humans for review

7. **(Optional) Self Code Review**
   - Agent re-runs the LLM over its own diff for a review pass
   - Posts review comments or a summary to the PR
   - Skippable for the initial implementation

#### Setup Checklist to Get Started

1. **Create agent repository** on GitHub (e.g., `creator-connect-agent`)
2. **Register GitHub App** in GitHub Settings → Developer settings → GitHub Apps
   - Set webhook URL to your deployed agent server (or localhost via tooling initially)
   - Configure permissions and events as above
   - Generate and save the private key
3. **Install the App** on the `creator-connect` repository
4. **Set up the webhook server** in the agent repo (receive GitHub events)
5. **Implement auth handler** using App ID + private key → installation token
6. **Implement issue reader** that fetches issue + discussion context when tagged
7. **Set up LLM client** pointed at NVIDIA Cloud endpoint with API key
8. **Implement PR pipeline** (branch → edits → commit → open PR)
9. **Add Discord webhook** integration for PR notifications
10. **Store secrets** (private key, NVIDIA API key, Discord webhook URL) in the agent's environment/CI secrets
11. **Deploy** the agent (serverless function, container, or VPS) reachable by GitHub webhook

#### Environments & Secrets Needed

| Secret | Purpose |
| --- | --- |
| `GITHUB_APP_ID` | GitHub App registration ID |
| `GITHUB_APP_PRIVATE_KEY` | Private key for generating installation tokens |
| `GITHUB_WEBHOOK_SECRET` | Validates incoming GitHub webhook payloads |
| `NVIDIA_API_KEY` | Auth for NVIDIA Cloud LLM inference |
| `NVIDIA_BASE_URL` | NVIDIA inference endpoint URL |
| `LLM_MODEL` | Model identifier to use for the agent |
| `DISCORD_WEBHOOK_URL` | Webhook for PR notifications channel |
