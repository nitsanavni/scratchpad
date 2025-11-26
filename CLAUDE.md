# Project Instructions

## Issue Tracking with Beads

This project uses [Beads](https://github.com/steveyegge/beads) for issue tracking.

### Session Start
Always run `bd ready` at the start of a session to see available work:
```bash
bd ready --json
```

### Common Commands
```bash
bd ready                    # See what's ready to work on
bd list                     # List all issues
bd show <issue-id>          # View issue details
bd create "title" -t task   # Create a task (-t bug, feature, epic, chore)
bd update <id> --status in_progress  # Claim work
bd close <id>               # Complete an issue
bd blocked                  # See blocked issues
```

### Workflow
1. Check `bd ready` for unblocked work
2. Claim with `bd update <id> --status in_progress`
3. Work on the issue
4. Close with `bd close <id>` when done
5. If you discover new work, create issues with `bd create`
