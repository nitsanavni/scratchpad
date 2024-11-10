#!/bin/bash

# Original command to run fzf
# selected=$(fzf)

# Update the command to use the '--multi' option for multi-selection
selected=$(fzf --multi --bind 'ctrl-a:select-all')

# Output all selected items, or, if none are selected, all filtered items
echo "$selected"
