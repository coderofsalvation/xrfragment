noremap <silent> <F9> :!./make doc<CR>
noremap <silent> <F10> :!./make && echo OK && ./make tests<CR>
noremap <silent> <F11> :!./make tests \| less<CR>
