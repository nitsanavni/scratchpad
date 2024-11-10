changes required: Create a script to read a list of files, search lines using ripgrep, and use `fzf` for fuzzy finding.

### File: `find_in_files.sh`

```bash
#!/bin/bash

# Read list of files from stdin
file_list=$(cat)

# Search using ripgrep with line numbers and pipe into fzf for fuzzy finding
rg --line-number $file_list | fzf
```
