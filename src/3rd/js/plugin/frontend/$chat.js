chatComponent = {

  html: `
    <div id="chat">
     <div id="videos" style="pointer-events:none"></div>
     <div id="messages" aria-live="assertive" role="log" aria-relevant="additions"></div>
     <div id="chatfooter">
       <div id="chatbar">
           <input id="chatline" type="text" placeholder="chat here"></input>
       </div>
       <button id="chatsend" class="btn" aria-label="send message">
          <i class="gg-chevron-right-o"></i>
       </button>
     </div>
    </div>
  `,

  init: (el) => new Proxy({

    scene:             null,
    visible:           true,
    messages:          [],
    oneMessagePerUser: false,

    username: '',    // configured by 'network.connected' event

    $videos:         el.querySelector("#videos"),
    $messages:       el.querySelector("#messages"),
    $chatline:       el.querySelector("#chatline"),
    $chatbar:        el.querySelector("#chatbar"),
    $chatsend:       el.querySelector("#chatsend"),
    
    install(opts){
      this.opts  = opts
      this.scene = opts.scene 
      this.$chatbar.style.display = 'none'
      el.className = "xrf"
      el.style.display = 'none' // start hidden 
      document.body.appendChild( el )
      document.dispatchEvent( new CustomEvent("$chat:ready", {detail: opts}) )
      this.send({message:`Welcome to <b>${document.location.search.substr(1)}</b>, a 3D scene(file) which simply links to other ones.<br>You can start a solo offline exploration in XR right away.<br>Type /help below, or use the arrow- or WASD-keys on your keyboard, and mouse-drag to rotate.<br>`, class: ["info","guide","multiline"] })
    },

    sendInput(value){
      if( value[0] == '#' ) return xrf.navigator.to(value)
      let event   = value.match(/^[!\/]/) ? "chat.command" : "network.send"
      let message = value.replace(/^[!\/]/,'')
      let raw     = {detail:{message:value, halt:false}}
      document.dispatchEvent( new CustomEvent( event, {detail: {message}} ) )
      document.dispatchEvent( new CustomEvent( "chat.input", raw ) )
      if( event == "network.send" && !raw.detail.halt ) this.send({message: value })
      this.$chatline.lastValue = value
      this.$chatline.value = ''
      if( window.innerHeight < 600 ) this.$chatline.blur()
    },

    initListeners(){
      let {$chatline} = this

      $chatline.addEventListener('click', (e) => this.inform() )

      $chatline.addEventListener('keydown', (e) => {
        if (e.key == 'Enter' ){
          this.sendInput($chatline.value)
        }
        if (e.key == 'ArrowUp' ){
          $chatline.value = $chatline.lastValue || ''
        }
      })

      document.addEventListener('network.connect', (e) => {
        this.visible = true
        this.$chatbar.style.display = '' // show
      })

      document.addEventListener('network.connected', (e) => {
        if( e.detail.username ) this.username = e.detail.username
      })

      document.addEventListener('chat.command', (e) => {
        if( String(e.detail.message).trim() == 'help' ){
          let detail = {message:`The following commands are available
          <br><br>
          <b class="badge">/help</b> shows this help screen
          `}
          document.dispatchEvent( new CustomEvent( 'chat.command.help', {detail}))
          this.send({message: detail.message})
        }
      })

      this.$chatsend.addEventListener('click', (e) => {
        this.sendInput($chatline.value)
      })

    },

    inform(){
      if( !this.inform.informed && (this.inform.informed = true) ){
        window.notify("You can now type messages in the textfield below.")
      }
    },

    toggle(){
      this.visible = !this.visible
      if( this.visible && window.meeting.status == 'offline' ) window.meeting.start(this.opts)
    },

    hyphenate(str){
      return String(str).replace(/[^a-zA-Z0-9]/g,'-')
    },

    // sending messages to the #messages div 
    // every user can post maximum one msg at a time 
    // it's more like a 'status' which is more friendly 
    // for accessibility reasons 
    // for a fullfledged chat/transcript see matrix clients
    send(opts){
      let {$messages} = this
      opts = { linebreak:true, message:"", class:[], ...opts }
      if( window.frontend && window.frontend.emit ) window.frontend.emit('$chat.send', opts )
      opts.pos  = opts.pos || network.posName || network.pos
      let div  = document.createElement('div')
      let msg  = document.createElement('div')
      let br   = document.createElement('br')
      let nick = document.createElement('div')
      msg.className = "msg"
      let html = `${ opts.message || ''}${ opts.html ? opts.html(opts) : ''}`
      if( $messages.last == html ) return
      msg.innerHTML = html 
      if( opts.el ) msg.appendChild(opts.el)
      opts.id       = Math.random()
      if( opts.class ){
        msg.classList.add.apply(msg.classList, opts.class)
        br.classList.add.apply(br.classList, opts.class)
        div.classList.add.apply(div.classList, opts.class.concat(["envelope"]))
      }
      if( !msg.className.match(/(info|guide|ui)/) && !opts.from ){
        let frag = xrf.URI.parse(document.location.hash).XRF
        opts.from = 'you'
        if( frag.pos ) opts.pos = frag.pos.string
        msg.classList.add('self')
      }
      if( opts.from ){
        nick.className = "user"
        nick.innerText = opts.from+' '
        div.appendChild(nick)
        if( opts.pos ){
          let a = document.createElement("a")
          a.href = a.innerText = `#pos=${opts.pos}`
          nick.appendChild(a)
        }
      }
      div.appendChild(msg)
      // force one message per user 
      if( this.oneMessagePerUser && opts.from ){
        div.id = this.hyphenate(opts.from)
        let oldMsg = $messages.querySelector(`#${div.id}`)
        if( oldMsg ) oldMsg.remove()
      }
      // remove after timeout
      if( opts.timeout ) setTimeout( (div) => div.remove(), opts.timeout, div )
      // finally add the message on top
      $messages.appendChild(div)
      if( opts.linebreak ) div.appendChild(br)
      $messages.scrollTop = $messages.scrollHeight // scroll down
      $messages.last = msg.innerHTML
    },

    getChatLog(){
        return ([...this.$messages.querySelectorAll('.envelope')])
                .filter( (d) => !d.className.match(/(info|ui)/) ) 
                .map( (d) => d.innerHTML )
                .join('\n')
    }

  },{

    get(me,k,v){ return me[k] },
    set(me,k,v){ 
      me[k] = v    
      switch( k ){
        case "visible":         { 
                                  el.style.display = me.visible ? 'block' : 'none'
                                  if( !el.inited && (el.inited = true) ) me.initListeners()
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
  window.$chat = document.createElement('div')
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
       z-index:1000;
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
     button#chatsend{
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
     button#chatsend{
      line-height:0px;
      display:none;
      z-index: 1550;
      color: white;
      border: 0;
      height: 35px;
      background: var(--xrf-dark-gray);
      font-weight: bold;
      width: 20px;
      max-width: 20px;
      border-radius: 20px 0px 0px 20px;
      overflow: hidden;
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
       /*
       display: flex;
       flex-direction: column;
       width: 100%;
       max-width: 40%;
       */
       width:100%;
       box-sizing:border-box;
       align-items: flex-start;
       position: absolute;
       transition:1s;
       top: 77px;
       left: 0;
       bottom: 49px;
       padding: 20px;
       overflow:hidden;
       overflow-y: auto;
       pointer-events:none;
       transition:1s;
       z-index: 100;
     }
     body.menu #messages{
       top:50px;
     }
     #messages:hover {
       pointer-events:all;
     }
     #messages *{
       box-sizing:border-box;
/*
       pointer-events:none;
       -webkit-user-select:none;
       -moz-user-select:-moz-none;
       -ms-user-select:none;
       user-select:none;
*/
     }
     #messages .msg{
       transition:all 1s ease;
       background: #fff;
       display: inline-block;
       padding: 1px 17px;
       border-radius: 20px;
       color: #000c;
       margin-bottom: 10px;
       line-height:23px;
       line-height:33px;
       cursor:grabbing;
       border: 1px solid #0002;
     }
     #messages .msg *,
     #messages .user *{
       pointer-events:all;
       -webkit-user-select:text;
       -moz-user-select:-moz-text;
       -ms-user-select:text;
       user-select:text;
    }

     #messages .msg.self{
       border-radius: 20px;
       background:var(--xrf-dark-gray);
     }
     #messages .msg.self,
     #messages .msg.self div{
       color:#FFF;
     }
     #messages .msg.info{
       background: var(--xrf-white);
       border-radius: 20px;
       color: var(--xrf-dark-gray);
       text-align: left;
       line-height: 19px;
     }
     #messages .msg.info,
     #messages .msg.info *{
       font-size: var(--xrf-font-size-0);
     }
     #messages .msg a {
       text-decoration:underline;
       color: var(--xrf-light-xrf-secondary);
       font-weight:bold;
       transition:0.3s;
     }
     #messages .msg.info a,
     #messages a.ruler{
       color:#FFF;
     }
     #messages .msg a:hover{
        color:#000;
     }
     #messages .msg.ui, 
     #messages .msg.ui div{ 
       background: white;
       border:none;
       color: #333;
       border-radius: 20px;
       margin:0;
       padding:0px 5px 5px 5px;
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
     #messages .msg.info a:hover,
     #messages button:hover{
       filter: brightness(1.4);
     }
     #messages .msg.multiline {
       padding: 2px 14px;
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

    .envelope{
      margin-right:15px;
      width:100%;
      max-width:40%;
    }

    .envelope,
    .envelope * {
      transition:1s;
      pointer-events:none;
    }
    .envelope a,
    .envelope button,
    .envelope input,
    .envelope textarea,
    .envelope msg,
    .envelope msg * {
      pointer-events:all;
    }

    .user{
      margin-left:13px;
      font-weight: bold;
      color: var(--xrf-dark-gray);
    }
    .user, .user *{ 
      font-size: var(--xrf-font-size-0);
    }
    .gg-chevron-right-o {
      color:#FFF;
      box-sizing: border-box;
      position: relative;
      display: block;
      transform: scale(var(--ggs,1));
      width: 22px;
      height: 22px;
      border: 2px solid;
      border-radius: 100px
    }

    .gg-chevron-right-o::after {
      color:#FFF;
      content: "";
      display: block;
      box-sizing: border-box;
      position: absolute;
      width: 6px;
      height: 6px;
      border-bottom: 2px solid;
      border-right: 2px solid;
      transform: rotate(-45deg);
      left: 5px;
      top: 6px
    }
   </style>`
