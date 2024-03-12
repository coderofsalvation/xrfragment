window.$editor = (opts) => new Proxy({
  opts,
  html: `
    <div class="xrf footer">
      <div class="menu">
        <div id="buttons"></div>
        <a class="btn" id="more" aria-title="menu button"><i id="icon" class="gg-menu"></i></a><br>
      </div>
    </div>
  `,

  enabled: false,

  toggle(){ this.enabled = !this.enabled },

  init(){
    el.innerHTML = this.html
    document.body.appendChild(el);
  },

},
{ 
  // auto-trigger events on changes 
  get(data,k,receiver){ return data[k] },
  set(data,k,v){ 
    data[k] = v 
    switch( k ){
      case "enabled": {
                        data.enabled = v
    }
  }
})

document.addEventListener('$menu:ready', (e) => {
  return
  try{
    $editor = $editor( document.createElement('div'), {} ) 
    $editor.init()
  }catch(e){console.error(e)}
})
