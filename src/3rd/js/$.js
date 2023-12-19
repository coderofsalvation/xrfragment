// this project uses #vanillajs #proxies #clean #noframework
//
// menu = $proxy({
//   attach:   'body',  
//   html:     (el) => `<ul><li>${el.items.join('</li><li>')}</li></lu>`,
//   items:    [1,2],
//   on: (el,k,v) => {
//     switch(k){
//       default:     return el.outerHTML = el.html(el)
//     }
//   }
// })
//
// menu.items = menu.items.concat([3,4])
// $('#foo')
// $$('.someclass').map( (el) => el.classList.toggle() )
// 
$proxy = (opts) => {
  let el = document.createElement('div')
  el.innerHTML = opts.html(opts)
  el.querySelector = el.querySelector.bind(el)
  el.appendChild   = el.appendChild.bind(el)
  let parent = typeof opts.attach == 'string' ? document.querySelector(opts.attach) : opts.attach
  parent.appendChild( el )
  el.on = el.addEventListener.bind(el)
  for( let i in opts ) el[i] = opts[i]  
  return new Proxy( el, {  
    get: (el,k,receiver) => el[k] || '',
    set: (el,k,v) => { el[k] = v; el.on(el,k,v) }
  })
}
$      = typeof $   != 'undefined' ? $  : (s) => document.querySelector(s)            // respect jquery
$$     = typeof $$  != 'undefined' ? $$ : (s) => [...document.querySelectorAll(s)]    // zepto etc.

$el = (html) => {
  let el = document.createElement('div')
  el.innerHTML = html
  return el.children[0]
}
