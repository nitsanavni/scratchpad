# Scratchpad

## Setup

### Prerequisites

Install the Beads issue tracker CLI:

```bash
curl -fsSL https://raw.githubusercontent.com/steveyegge/beads/main/scripts/install.sh | bash
```

Install the MCP server (for Claude Code integration):

```bash
# Install uv if needed
curl -LsSf https://astral.sh/uv/install.sh | sh

# Install beads-mcp
uv tool install beads-mcp
```

### Initialize Beads in a Project

```bash
bd init --quiet
```

### MCP Configuration

Add to `.mcp.json`:

```json
{
  "mcpServers": {
    "beads": {
      "type": "stdio",
      "command": "beads-mcp",
      "args": [],
      "env": {
        "BEADS_USE_DAEMON": "1"
      }
    }
  }
}
```
