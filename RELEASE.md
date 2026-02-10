# Creating a new Release

You can trigger a `workflow_dispatch` workflow in two ways:

### 1. GitHub Web UI

1. Go to your repository on GitHub
2. Click the **Actions** tab
3. Select **"Release on GitHub"** from the workflow list on the left
4. Click the **"Run workflow"** button (top right)
5. Select the branch (e.g., `main`)
6. Click **"Run workflow"**

### 2. GitHub CLI (`gh`)

From your terminal:

```bash
gh workflow run "Release on GitHub" --ref main
```

You can check the status with:

```bash
gh run list --workflow=release.yml
```
