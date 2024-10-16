write a new shell scipt `fzf-tmux.sh`

it will be called with the servername as an argument
example:
:execute '!your-shell-script.sh ' . v:servername


inside it will:
tmux neww
bash --norc --noprofile
nvr --servername $servername --remote-send "<esc>:e $e(fzf)<cr>"
