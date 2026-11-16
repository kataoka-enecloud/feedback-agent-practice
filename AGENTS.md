## Git

To open a PR:

1. Revert every change the PR's point doesn't need.
2. Rewrite the branch as one commit per logical change, keeping the final tree unchanged.
3. Spawn a fresh subagent whose entire prompt is `/pr`.
