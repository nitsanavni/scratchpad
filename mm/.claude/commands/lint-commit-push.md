# Lint, Commit and Push

Always run this sequence after each small change or micro step:

```bash
bunx prettier --write .
git add .
git commit -m "Your commit message"
git push
```

This ensures:

- Code is properly formatted
- Changes are saved to version control immediately
- Work is backed up to remote repository
- Clean development history with frequent commits
