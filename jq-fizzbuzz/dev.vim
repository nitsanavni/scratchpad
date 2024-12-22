command Approve execute "silent !./approve.sh" | redraw!
nnoremap <Leader>a :Approve<CR>
nnoremap <leader>s :w<CR>

command TypistType call TypistTypeFunc()
function! TypistTypeFunc()
  " Get the current file name
  let current_file = expand('%:t')

  " Start a new buffer in a split at the bottom
  split
  enew

  " Insert the content
  call setline(1, './' . current_file)
  call append(1, '')
  call append(2, '')

  " Move the cursor to the last line and enter insert mode
  normal! G
  startinsert
endfunction
