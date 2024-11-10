function! FzfBufferLinesInTmux()
  call system('touch /tmp/fzf-selection')
  call system('tmux neww "cat -n ' . expand('%') . ' | fzf --reverse --preview ''echo {}'' > /tmp/fzf-selection"')
  let fzf_selection = system("ls /tmp/fzf-selection | entr -npz cat /tmp/fzf-selection")
  let line_number = matchstr(fzf_selection, '^\s*\zs\d\+')
  execute 'normal! ' . line_number . 'G'
endfunction

command! FzfBufferLinesInTmux call FzfBufferLinesInTmux()
