#!/usr/bin/env python3
import os
import json
import subprocess
import urllib.request
import urllib.parse
import ssl

def read_event(path):
    with open(path, 'r') as f:
        return json.load(f)

GITHUB_API = 'https://api.github.com'

def api_request(method, path, token, data=None):
    url = GITHUB_API + path
    headers = {
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'junior-agent-bot',
        'Authorization': f'token {token}'
    }
    if data is not None:
        body = json.dumps(data).encode('utf-8')
        headers['Content-Type'] = 'application/json'
    else:
        body = None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    ctx = ssl.create_default_context()
    try:
        with urllib.request.urlopen(req, context=ctx) as resp:
            resp_data = resp.read().decode('utf-8')
            if resp_data:
                return json.loads(resp_data)
            return None
    except urllib.error.HTTPError as e:
        print('API error', e.code, e.read().decode())
        raise

def main():
    event_path = os.environ.get('GITHUB_EVENT_PATH')
    token = os.environ.get('GITHUB_TOKEN')
    repo = os.environ.get('GITHUB_REPOSITORY')
    if not (event_path and token and repo):
        print('Missing required environment variables: GITHUB_EVENT_PATH, GITHUB_TOKEN, GITHUB_REPOSITORY')
        return

    event = read_event(event_path)
    event_name = os.environ.get('GITHUB_EVENT_NAME')

    # Determine issue number and trigger
    issue = event.get('issue') or event.get('pull_request')
    issue_number = None
    if issue:
        issue_number = issue.get('number')

    triggered = False
    trigger_reason = None

    # Check for mention in comment
    comment = event.get('comment')
    if comment and isinstance(comment, dict):
        body = comment.get('body', '')
        if '@junior-dev-bot' in body:
            triggered = True
            trigger_reason = 'mention in comment'

    # Check for issue body mention
    if not triggered and issue:
        body = issue.get('body', '') or ''
        if '@junior-dev-bot' in body:
            triggered = True
            trigger_reason = 'mention in issue body'

    # Check label
    if not triggered and event.get('label'):
        label_name = event['label'].get('name','')
        if label_name.lower() == 'junior-agent':
            triggered = True
            trigger_reason = 'label junior-agent'

    if not triggered:
        print('No trigger found; exiting.')
        return

    if not issue_number:
        print('No issue number found in event; exiting.')
        return

    owner, repo_name = repo.split('/')

    # Post an acknowledging comment
    comment_body = (
        "Hi — I'm the Junior Dev Agent. I saw the trigger ({}). I'll create a branch, add an initial plan file, and open a WIP pull request to start work."
        .format(trigger_reason)
    )
    api_request('POST', f'/repos/{owner}/{repo_name}/issues/{issue_number}/comments', token, {'body': comment_body})
    print('Posted acknowledgement comment')

    # Create a branch and commit a plan file
    branch = f'junior/issue-{issue_number}/start'
    plan_path = f'work/issue-{issue_number}-plan.md'
    plan_content = f"""# Plan for issue #{issue_number}

This is an initial plan created by the Junior Dev Agent.

- Reproduce the issue
- Add tests (if applicable)
- Implement fix / feature
- Run tests and CI
- Open PR for review

Notes:
- Trigger: {trigger_reason}
"""

    # Create branch locally, resetting it if it already exists
    subprocess.run(['git', 'config', 'user.name', 'junior-agent-bot'], check=True)
    subprocess.run(['git', 'config', 'user.email', 'junior@local'], check=True)
    # Create branch from current HEAD (-B resets an existing branch)
    subprocess.run(['git', 'checkout', '-B', branch], check=True)

    # Write the plan file
    os.makedirs(os.path.dirname(plan_path), exist_ok=True)
    with open(plan_path, 'w') as f:
        f.write(plan_content)

    subprocess.run(['git', 'add', plan_path], check=True)
    subprocess.run(['git', 'commit', '-m', f'feat: junior agent — start work for issue #{issue_number}'], check=True)

    # Push branch using token auth. Delete any stale copy of this bot branch
    # first so re-runs on the same issue are idempotent.
    push_url = f'https://x-access-token:{token}@github.com/{owner}/{repo_name}.git'
    subprocess.run(['git', 'push', push_url, '--delete', f'refs/heads/{branch}'], check=False)
    subprocess.run(['git', 'push', push_url, f'HEAD:refs/heads/{branch}'], check=True)
    print('Pushed branch', branch)

    # Get default branch
    repo_info = api_request('GET', f'/repos/{owner}/{repo_name}', token)
    default_branch = repo_info.get('default_branch', 'main')

    # Reuse an existing open PR for this branch instead of opening a duplicate
    existing_prs = api_request('GET', f'/repos/{owner}/{repo_name}/pulls?state=open&head=' + urllib.parse.quote(f'{owner}:{branch}'), token)
    existing_pr = next((pr for pr in existing_prs if pr.get('head', {}).get('ref') == branch), None)
    if existing_pr:
        pr_url = existing_pr.get('html_url')
        print('Reusing existing PR', existing_pr.get('number'))
    else:
        pr_title = f'WIP: start work on issue #{issue_number} — junior agent'
        pr_body = f'Automated work-in-progress branch created by the Junior Dev Agent for issue #{issue_number}. See {plan_path} for the initial plan.'
        pr = api_request('POST', f'/repos/{owner}/{repo_name}/pulls', token, {
            'title': pr_title,
            'head': branch,
            'base': default_branch,
            'body': pr_body
        })
        pr_url = pr.get('html_url')
        print('Created PR', pr.get('number'))

    # Post a comment with the PR link
    api_request('POST', f'/repos/{owner}/{repo_name}/issues/{issue_number}/comments', token, {'body': f'WIP PR: {pr_url}'})
    print('Posted PR link to issue')

if __name__ == '__main__':
    main()