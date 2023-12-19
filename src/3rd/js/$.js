// the core project uses #vanillajs #proxies #clean #noframework
$      = typeof $   != 'undefined' ? $  : (s) => document.querySelector(s)            // respect jquery
$$     = typeof $$  != 'undefined' ? $$ : (s) => [...document.querySelectorAll(s)]    // zepto etc.

$el = (html,tag) => {
  let el = document.createElement('div')
  el.innerHTML = html
  return el.children[0]
}
