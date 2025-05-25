# Capture What We Just Learned in CLAUDE.md

When we discover or establish new workflow patterns, technical decisions, or important insights:

1. Immediately add the learning to the appropriate section in `CLAUDE.md`
2. Follow the standard workflow: lint, commit, and push
3. This creates a living document of project wisdom

## Example workflow:

```bash
# Edit CLAUDE.md to capture the new learning
# Then:
bunx prettier --write .
git add CLAUDE.md
git commit -m "Capture [specific learning] in development guidelines"
git push
```

This ensures knowledge is preserved and available for future development sessions.
