let's create a new script find_in_files.sh

it reads a file list from stdin
then use rg --line-number file-list | fzf
to fuzzy find a line of code in all the files

