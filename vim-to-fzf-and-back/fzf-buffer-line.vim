function! FzfBufferLinesInTmux()
  " Touch the temp file to ensure it exists
  call system('touch /tmp/fzf-selection')

  " Use cat -n to number lines and fzf for selecting from current buffer
  call system('tmux neww "cat -n ' . expand('%') . ' | fzf --preview ''echo {}'' > /tmp/fzf-selection"')

  " Watch the temp file for changes and reload the selection in Vim
  let fzf_selection = system("ls /tmp/fzf-selection | entr -npz cat /tmp/fzf-selection")

  " Parse the selected line number (before the first tab or space)
  let line_number = matchstr(fzf_selection, '^\s*\d\+')

  let no_whitespace = substitute(line_number, '\s', '', 'g')

  echo line_number

  " Go to the selected line using normal mode
  " _whitespace 'G'
  "ne_number 'G'execute 'normal! ' line_number . 'G'

  "normal! line_number 'G'
  execute 'normal! ' . no_whitespace . 'G'
endfunction

" Map the function to a command
command! FzfBufferLinesInTmux call FzfBufferLinesInTmux()
