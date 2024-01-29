// the core project uses #vanillajs #proxies #clean #noframework
var $      = typeof $   != 'undefined' ? $  : (s) => document.querySelector(s)            // respect jquery
var $$     = typeof $$  != 'undefined' ? $$ : (s) => [...document.querySelectorAll(s)]    // zepto etc.

var $el = (html,tag) => {
  let el = document.createElement('div')
  el.innerHTML = html
  return el.children[0]
}
