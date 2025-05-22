# mm - CLI Mindmap Viewer & Editor

A command-line mindmap viewer and editor for `.mm` files using double-space indentation.

## Installation

```bash
bun install
```

## Usage

### View a mindmap (static)

```bash
bun simple-viewer.tsx examples/simple.mm
```

### Interactive mindmap viewer

```bash
bun cli.tsx examples/simple.mm
```

**Controls:**

- `↑/↓` arrow keys: Navigate between nodes
- `q` or `Ctrl+C`: Quit

### Available example files

- `examples/simple.mm` - Basic personal tasks
- `examples/project.mm` - Complex web application structure
- `examples/learning.mm` - Programming learning path

## File Format

Mindmap files use `.mm` extension with double-space indentation:

```
Root Node
  Child Node 1
    Grandchild
  Child Node 2
Another Root Node
  Another Child
```

## Development

Run tests:

```bash
bun test
```

Format code:

```bash
bunx prettier --write .
```

Install git hooks:

```bash
.githooks/install.sh
```

This project was created using `bun init` in bun v1.2.11. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
