noremap <silent> <F8> :!haxe --no-output %<CR>
noremap <silent> <F9> :!./make build_js<CR>
noremap <silent> <F10> :!./make && echo OK && ./make tests<CR>
noremap <silent> <F11> :!./make tests \| less<CR>
