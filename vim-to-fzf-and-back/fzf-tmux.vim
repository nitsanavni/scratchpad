function! FzfInTmux()
  " Touch the temp file to ensure it exists
  call system('touch /tmp/fzf-selection')

  " Start a new tmux window with fzf and save selection to /tmp/fzf-selection
  call system('tmux neww "fzf > /tmp/fzf-selection"')

  " Watch the temp file for changes and reload in vim when updated
  let fzf_selection = system("ls /tmp/fzf-selection | entr -npz cat /tmp/fzf-selection")

  " Edit the file that was selected by fzf
  execute 'edit' fzf_selection
endfunction

" Map the function to a command
command! FzfInTmux call FzfInTmux()
