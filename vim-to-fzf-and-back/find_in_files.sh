#!/bin/bash

file_list=$(cat)
rg -n --with-filename '' $file_list | fzf --tmux
