call system('select_and_find_in_files.sh') | call system('sleep .01') | execute 'edit +' . matchstr(system('cat /tmp/loc'), ':\zs\d\+:\ze') . ' ' . matchstr(system('cat /tmp/loc'), '^[^:]*')
