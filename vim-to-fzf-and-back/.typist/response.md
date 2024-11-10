To improve the script, we can create a user command and then map it to a shortcut. Here's how you can do it:

changes required: Create a user command for executing the shell script and open the file at a specific location, then map this command to a keybinding.

### File: `./find_in_files.vim`

```vim
" Define a user command to execute the system command and open the file
command! -nargs=0 FindInFiles :call system('select_and_find_in_files.sh') |
    \ call system('sleep .01') |
    \ execute 'edit +' . matchstr(system('cat /tmp/loc'), ':\zs\d\+:\ze') . ' ' . matchstr(system('cat /tmp/loc'), '^[^:]*')

" Map the user command to a keybinding
nnoremap ,f :FindInFiles<CR>
```

This setup defines a user command `FindInFiles` and maps it to `,f`. This makes the script cleaner and easier to maintain.
