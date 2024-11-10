#!/bin/bash

file_list=$(cat)

rg -n '' $file_list | fzf
