noremap <silent> <F8> :!haxe --no-output %<CR>
noremap <silent> <F9> :!./make build js<CR>
noremap <silent> <F10> :!./make build && ./make tests<CR>
noremap <silent> <F11> :!./make tests \| less<CR>
