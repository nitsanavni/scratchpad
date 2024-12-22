command! Approve execute "silent !./approve.sh" | redraw!
nnoremap <Leader>a :Approve<CR>
nnoremap <Leader>s :w<CR>

command! TypistPrompt call TypistPromptFunc()
function! TypistPromptFunc()
  " Get the current file name
  let current_file = expand('%:t')

  " Start a new buffer in a split at the bottom
  split
  enew

  " Insert the content
  call setline(1, './' . current_file)
  call append(line('.'), ['', '']) " Append empty lines at cursor

  " Enter insert mode at the last empty line
  normal! G
  startinsert
endfunction
nnoremap <Leader>p :TypistPrompt<CR>
nnoremap <Leader>t :%w !typist<CR> :q!<CR>
