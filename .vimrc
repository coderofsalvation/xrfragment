noremap <silent> <F8> :!haxe --no-output %<CR>
noremap <silent> <F9> :!./make doc<CR>
noremap <silent> <F10> :!./make && echo OK<CR>
noremap <silent> <F11> :!./make tests \| less<CR>
