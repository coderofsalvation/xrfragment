window.debug = (opts) => new Proxy({
  opts,

  enabled: false,
  $console: false,


  toggle(){ this.enabled = !this.enabled },

  settings(){
    this.toggle()
  },

  init(){
  },

  setupConsole(){
    // add onscreen console
    let $console = this.$console = document.createElement('pre')
    $console.style.position = 'fixed'
    $console.style.overflow = 'auto'
    $console.style.top = $console.style.left = $console.style.bottom = $console.style.right = '0px'
    $console.style.height = '98.5vh';
    $console.style.width = '100%'
    $console.style.pointerEvents = 'none'
    $console.id = 'console'
    document.body.appendChild($console)
    const wrapper = (scope, fn, name) => {
      return function(msg) {
        $console.innerHTML += `[${name}] ${msg}<br>`;
        if( name == 'err'){
          let err = new Error()
          String(err.stack).split("\n").slice(2).map( (l) => $console.innerHTML += ` └☑ ${l}\n` )
        }
        $console.scrollTop = $console.scrollHeight;
        fn.call(scope,msg);
      };
    }
    window.console.log   = wrapper(console, console.log, "log");
    window.console.warn  = wrapper(console, console.warn, "wrn");
    window.console.error = wrapper(console, console.error, "err");
  }

},
{ 
  // auto-trigger events on changes 
  get(data,k,receiver){ return data[k] },
  set(data,k,v){ 
    data[k] = v 
    switch( k ){
      case "enabled": {
                        if( !data.$console ) data.setupConsole()
                        $('#debug.btn').style.filter= v ? 'brightness(1.0)' : 'brightness(0.5)'
                        data.$console.style.display = v ? 'block' : 'none'
                        data.enabled = v
                      }
    }
  }
})

document.addEventListener('$menu:ready', (e) => {
  try{
    debug = debug(e.detail) 
    debug.init()
    document.dispatchEvent( new CustomEvent("debug:ready", e ) )
    $menu.buttons = $menu.buttons.concat([`<a class="btn" style="background:var(--xrf-dark-gray);filter: brightness(0.5);" aria-label="button" aria-description="enable all debug features" id="debug" onclick="debug.enabled = !debug.enabled"><i class="gg-debug"></i>debug</a><br>`])
  }catch(e){console.error(e)}
})

document.querySelector('head').innerHTML += `
  <style type="text/css"> 
    .gg-debug {
       box-sizing: border-box;
       position: relative;
       display: block;
       transform: scale(var(--ggs,1));
       width: 12px;
       height: 18px;
       border: 2px solid;
       border-radius: 22px;
       display: inline-block;
       transform: translate(0px,4px);
       margin-right: 21px;
    }
    .gg-debug::after,
    .gg-debug::before {
       content: "";
       display: block;
       box-sizing: border-box;
       position: absolute
    }
    .gg-debug::before {
       width: 8px;
       height: 4px;
       border: 2px solid;
       top: -4px;
       border-bottom-left-radius: 10px;
       border-bottom-right-radius: 10px;
       border-top: 0
    }
    .gg-debug::after {
       background: currentColor;
       width: 4px;
       height: 2px;
       border-radius: 5px;
       top: 4px;
       left: 2px;
       box-shadow:
          0 4px 0,
          -6px -2px 0,
          -6px 2px 0,
          -6px 6px 0,
          6px -2px 0,
          6px 2px 0,
          6px 6px 0
    }
  </style>
`

