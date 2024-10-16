#!/bin/bash

# Ensure the script is being provided a servername as an argument.
if [ -z "$1" ]; then
  echo "Usage: $0 <servername>"
  exit 1
fi

servername=$1

# Start a new tmux window and execute the fzf command using nvim.
tmux neww \
  bash --norc --noprofile -c "\
  nvr --servername $servername --remote-send \"<esc>:e \$(fzf)<cr>\""


# tmux neww fzf
