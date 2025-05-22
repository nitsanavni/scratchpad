# TDD Instructions

- Use `bun test` to run tests
- Follow test-driven development approach: write tests first, then implement
- Test files should be named `*.test.ts`
- Don't mention TDD explicitly in commit messages

# Development Workflow

- Commit and push very often
- Use prettier for code formatting: `bunx prettier --write .`
- Git hooks are in `.githooks/` directory
- Run `.githooks/install.sh` to install hooks

# Tool Usage & Testing Interactive CLI Apps

## Testing Interactive Apps

- **Problem**: Interactive CLI apps (like Ink apps) cannot be tested with regular Bash tool due to stdin/tty requirements
- **Solution**: Use tmux tools for testing interactive CLI applications
- **Workflow**:
  1. Use `mcp__tmux__read` to check current pane state first
  2. Use `mcp__tmux__send_keys` to navigate to project directory
  3. Use `mcp__tmux__send_keys` to run interactive CLI commands
  4. Use `mcp__tmux__read` to verify output and behavior
  5. Send keyboard inputs (arrows, q, etc.) via `mcp__tmux__send_keys`

## Tech Stack Decisions

### CLI Framework: Ink

- **Chosen**: Ink (React-based CLI framework)
- **Pros**:
  - Component-based architecture fits mindmap tree structure
  - Built-in keyboard handling and focus management
  - Rich ecosystem with React patterns
- **Cons**:
  - Performance concerns with deep trees (needs investigation)
  - React dependency adds complexity
- **Alternatives considered**: Blessed, log-update, raw terminal manipulation

### Runtime: Bun

- **Chosen**: Bun for TypeScript execution and package management
- **Benefits**: Fast startup, native TypeScript support, npm-compatible
- **Usage**: `bun test`, `bun add`, `bun run script.tsx`

### File Format: .mm

- **Format**: Plain text with double-space indentation for hierarchy
- **Parser**: Custom parser that handles irregular indentation gracefully
- **Formatter**: Bidirectional conversion (parse ↔ format) with roundtrip tests

## Development Lessons Learned

### React Version Compatibility

- **Issue**: Ink requires React 18, not React 19
- **Solution**: Explicitly install `react@^18 @types/react@^18`
- **TSConfig**: Use `"jsx": "react"` not `"jsx": "react-jsx"` for Ink compatibility

### File Structure

- Keep related functionality together: `renderer.ts`, `formatter.ts`, `roundtrip.test.ts`
- Separate concerns: parsing logic vs. display logic vs. file I/O
- Example files in `examples/` directory for testing

### Testing Strategy

- Unit tests for core parsing/formatting logic
- Roundtrip tests to ensure parse → format → parse integrity
- Interactive testing via tmux tools for UI behavior
- Comprehensive edge cases: empty files, deep nesting, irregular indentation
