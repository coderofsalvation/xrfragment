chatComponent = {

  html: `
     <div id="videos" style="pointer-events:none"></div>
     <div id="messages" aria-live="assertive" aria-relevant></div>
     <div id="chatfooter">
       <div id="chatbar">
           <input id="chatline" type="text" placeholder="type here"></input>
       </div>
       <button id="showchat" class="btn">show chat</button>
     </div>
    </div>
  `,

  init: (el) => new Proxy({

    scene:    null,
    visible:  true,
    messages: [],

    $messages: $messages = el.querySelector("#messages"),
    $chatline: $chatline = el.querySelector("#chatline"),
    
    install(opts){
      this.opts  = opts
      this.scene = opts.scene 
      el.className = "xrf"
      el.style.display = 'none' // start hidden 
      document.body.appendChild( el )
      document.dispatchEvent( new CustomEvent("$chat:ready", {detail: opts}) )
      $chat.send({message:`Welcome to <b>${document.location.search.substr(1)}</b>, a 3D scene(file) which simply links to other ones.<br>You can start a solo offline exploration in XR right away.<br>Type /help below, or use the arrow- or WASD-keys on your keyboard, and mouse-drag to rotate.<br>`, class: ["info","multiline"] })
    },

    initListeners(){
      //opts.scene.addEventListener('meeting.peer.add',    () => console.log("$chat.peer.add") )
      //opts.scene.addEventListener('meeting.peer.remove', () => console.log("$chat.peer.remove") )
      $chatline.addEventListener('keydown', (e) => {
        if (e.key == 'Enter' ){
          this.send({message: $chatline.value })
          $chatline.value = ''
        }
      })
      console.dir(this.scene)
    },

    toggle(){
      this.visible = !this.visible
      if( this.visible && window.meeting.status == 'offline' ) window.meeting.start(this.opts)
    },

    send(opts){
      opts = { linebreak:true, message:"", class:[], ...opts }
      let div = document.createElement('div')
      let msg = document.createElement('div')
      let br  = document.createElement('br')
      msg.className = "msg"
      let html = `${ opts.message || ''}${ opts.html ? opts.html(opts) : ''}`
      if( $messages.last == html ) return
      msg.innerHTML = html 
      if( opts.el ) msg.appendChild(opts.el)
      opts.id       = Math.random()
      if( opts.class ){
        msg.classList.add.apply(msg.classList, opts.class)
        br.classList.add.apply(br.classList, opts.class)
      }
      div.appendChild(msg)
      $messages.appendChild(div)
      if( opts.linebreak ) div.appendChild(br)
      $messages.scrollTop = $messages.scrollHeight // scroll down
      document.dispatchEvent( new CustomEvent("$chat:receive", {detail: opts}) )
      $messages.last = msg.innerHTML
    }

  },{

    get(data,k,v){ return data[k] },
    set(data,k,v){ 
      data[k] = v    
      switch( k ){
        case "visible": { 
                           el.style.display = data.visible ? 'block' : 'none'
                           if( !el.inited && (el.inited = true) ) data.initListeners()
                           $menu.collapsed = !data.visible
                           break;
                        }
      }
    }

  })
}

// reactify component!
document.addEventListener('$menu:ready', (opts) => {
  opts = opts.detail
  document.head.innerHTML += chatComponent.css 
  $chat = document.createElement('div')
  $chat.innerHTML = chatComponent.html
  $chat = chatComponent.init($chat)
  $chat.install(opts)
  //$menu.buttons = ([`<a class="btn" aria-label="button" aria-description="toggle text" id="meeting" onclick="$chat.toggle()">📜 toggle text</a><br>`])
  //                  .concat($menu.buttons)
})

// alpine component for displaying meetings

chatComponent.css = `
    <style type="text/css">
     #videos{
       display:grid-auto-columns;
       grid-column-gap:5px;
       margin-bottom:15px;
       position: fixed;
       top: 0;
       left: 0;
       bottom: 0;
       right: 0;
       margin: 15px;
       z-index:1500;
     }
     #videos > video{
       border-radius:7px;
       display:inline-block;
       background:black;
       width:80px;
       height:60px;
       margin-right:5px;
       margin-bottom:5px;
       vertical-align:top;
       pointer-events:all;
     }
     #videos > video:hover{
       filter: brightness(1.8);
       cursor:pointer;
     }

     #chatbar,
     button#showchat{
       z-index: 1500;
       position: fixed;
       bottom: 24px;
       height: 34px;
       left: 20px;
       width: 48%;
       background: white;
       padding: 0px 0px 0px 15px; 
       border-radius: 30px;
       max-width: 500px;
       box-sizing: border-box;
       box-shadow: 0px 0px 5px 5px #0002;
     }
     button#showchat{
       z-index:1550;
       color:white;
       border:0;
       display:none;
       height: 44px;
       background:#07F;
       font-weight:bold;
     }
     #chatbar input{
       border:none;
       width:90%;
       box-sizing:border-box;
       height: 24px;
       font-size: var(--xrf-font-size-2);
       max-width:unset;
     }
     #messages{
       position: absolute;
       top: 100px;
       left: 0;
       right: 0;
       bottom: 88px;
       padding: 15px;
       pointer-events: none;
       overflow-y:auto;
     }
     #messages .msg{
       background: #fff;
       display: inline-block;
       padding: 6px 17px;
       border-radius: 20px;
       color: #000c;
       margin-bottom: 10px;
       line-height:23px;
       pointer-events:visible;
       border: 1px solid #ccc8;
       line-height:33px;
     }
     #messages .msg.info{
       font-size: 14px;
       padding: 3px 16px;
     }
     #messages.guide, .guide{
      display:unset;
     }
     #messages .guide, .guide{
       display:none;
     }
     br.guide{
       display:inline-block;
     }
     #messages .msg.info a,
     #messages .msg.info a:visited{
       color: var(--xrf-primary);
       text-decoration: underline;
       transition:0.3s;
     }
     #messages .msg.info a:hover,
     #messages button:hover{
       filter: brightness(1.4);
     }
     #messages .msg.multiline {
       padding: 2px 14px;
     }
     #messages .msg.config {
background:#
     }
     #messages button {
       text-decoration:none;
       margin: 0px 15px 10px 0px;
       background: var(--xrf-primary);
       font-family: var(--xrf-font-sans-serif);
       color: #FFF;
       border-radius: 7px;
       padding: 11px 15px;
       border: 0;
       font-weight: bold;
       box-shadow: 0px 0px 5px 5px #0002;
       pointer-events:all;
     }
     #messages,#chatbar,#chatbar *, #messages *{
     }


    #messages button.emoticon,
    #messages .btn.emoticon {
      line-height:2px;
      width: 20px;
      display: inline-block;
      padding: 0px 0px;
      margin: 0;
      vertical-align: middle;
      background: none;
      border: none;
      min-width: 31px;
      box-shadow:none;
    }

    #messages button.emoticon:hover,
    #messages .btn.emoticon:hover {
      border: 1px solid #ccc !important;
      background:#EEE;
    }

    .nomargin{
      margin:0;
    }
   </style>`
