" Define a user command to execute the system command and open the file
command! -nargs=0 FindInFiles :call system('select_and_find_in_files.sh') |
    \ call system('sleep .01') |
    \ execute 'edit +' . matchstr(system('cat /tmp/loc'), ':\zs\d\+:\ze') . ' ' . matchstr(system('cat /tmp/loc'), '^[^:]*')

" Map the user command to a keybinding
nnoremap ,f :FindInFiles<CR>
