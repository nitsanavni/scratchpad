Certainly! 

Changes required: Ensure `rg` always prints the filename by adding the `--with-filename` option.

### File: `./find_in_files.sh`

```bash
#!/bin/bash

file_list=$(cat)
rg -n --with-filename '' $file_list | fzf --tmux
```

Let me know if you need further assistance!
