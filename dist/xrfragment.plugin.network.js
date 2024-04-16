(function(){
// this orchestrates multiplayer events from the scene graph

window.network = (opts) => new Proxy({

  connected: false,
  pos: '',
  posName: '',
  meetinglink: "",
  peers: {},
  plugin: {},
  opts,

  init(){
    document.addEventListener('network.disconnect', () => this.connected = false )
    document.addEventListener('network.connected',  () => this.connected = true  )
    setTimeout( () => window.frontend.emit('network.init'), 100 )
    return this
  },

  connect(opts){
    window.frontend.emit(`network.${this.connected?'disconnect':'connect'}`,opts)
  },

  add(peerid,data){
    data = {lastUpdated: new Date().getTime(), id: peerid, ...data }
    this.peers[peerid] = data 
    window.frontend.emit(`network.peer.add`,{peer})
  },

  remove(peerid,data){
    delete this.peers[peerid]
    window.frontend.emit(`network.peer.remove`,{peer})
  },

  send(opts){
    window.frontend.emit('network.send',opts)
  },

  receive(opts){

  },

  getMeetingFromUrl(url){
    let hash = url.replace(/.*#/,'')
    let parts = hash.split("&")
    let meeting = ''
    parts.map( (p) => {
      if( p.split("=")[0] == 'meet' ) meeting = p.split("=")[1]
    })
    return meeting
  },

  randomRoom(){
    var names = []
    let add = (s) => s.length < 6 && !s.match(/[0-9$]/) && !s.match(/_/) ? names.push(s) : false
    for ( var i in window             ) add(i)
    for ( var i in Object.prototype   ) add(i)
    for ( var i in Function.prototype ) add(i)
    for ( var i in Array.prototype    ) add(i)
    for ( var i in String.prototype   ) add(i) 
    var a = names[Math.floor(Math.random() * names.length)];
    var b = names[Math.floor(Math.random() * names.length)];
    return String(`${a}-${b}-${String(Math.random()).substr(13)}`).toLowerCase()
  }

},
{ 
  // auto-trigger events on changes 
  get(data,k,receiver){ return data[k] },
  set(data,k,v){
    let from   = data[k]
    data[k] = v
  }
})
      
document.addEventListener('frontend:ready', (e) => {
  window.network = network(e.detail).init()
  document.dispatchEvent( new CustomEvent("network:ready", e ) )
})
connectionsComponent = {

  html: `
   <div id="connections">
      <i class="gg-close-o" id="close" onclick="$connections.visible = false"></i>
      <br>
      <div class="tab-frame">
        <input type="radio" name="tab" id="login" checked>
        <label for="login">login</label>

        <input type="radio" name="tab" id="io">
        <label for="io">devices</label>
       
        <input type="radio" name="tab" id="networks">
        <label for="networks">advanced</label>
          
        <div class="tab">
          <div id="settings"></div>
          <table>
            <tr>
              <td></td>
              <td>
                <button id="connect" onclick="network.connect( $connections )">📡 Connect!</button>
              </td>
            </tr>
        </table>
        </div>

        <div class="tab">
          <div id="devices">
            <a class="badge ruler">Webcam and/or Audio</a>
            <table>
              <tr>
                <td>Video</td>
                <td>
                  <select id="videoInput"></select> 
                </td>
              </tr>
              <tr>
                <td>Mic</td>
                <td>
                  <select id="audioInput"></select> 
                </td>
              </tr>
              <tr style="display:none"> <!-- not used (for now) -->
                <td>Audio</td>
                <td>
                  <select id="audioOutput"></select> 
                </td>
              </tr>
            </table>
          </div>
        </div>

        <div class="tab">
          <div id="networking">
            Networking a la carte:<br>
            <table>
              <tr>
                <td>Webcam</td>
                <td>
                  <select id="webcam"></select>
                </td>
              </tr>
              <tr>
                <td>Chat</td>
                <td>
                  <select id="chatnetwork"></select>
                </td>
              </tr>
              <tr>
                <td>World sync</td>
                <td>
                  <select id="scene"></select>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,

  init: (el) => new Proxy({

    visible: true,

    webcam:       [{profile:{name:"No thanks"},config: () => document.createElement('div')}],
    chatnetwork:  [{profile:{name:"No thanks"},config: () => document.createElement('div')}],
    scene:        [{profile:{name:"No thanks"},config: () => document.createElement('div')}],

    selectedWebcam:     '',
    selectedChatnetwork:'',
    selectedScene:      '',

    $webcam:       $webcam      = el.querySelector("#webcam"),
    $chatnetwork:  $chatnetwork = el.querySelector("#chatnetwork"),
    $scene:        $scene       = el.querySelector("#scene"),
    $settings:     $settings    = el.querySelector("#settings"),
    $devices:      $devices     = el.querySelector("#devices"),
    $connect:      $connect     = el.querySelector("#connect"),
    $networking:   $networking  = el.querySelector("#networking"),
 
    $audioInput:   el.querySelector('select#audioInput'),
    $audioOutput:  el.querySelector('select#audioOutput'),
    $videoInput:   el.querySelector('select#videoInput'),
    
    install(opts){
      this.opts  = opts;
      (['change']).map( (e) => el.addEventListener(e, (ev) => this[e] && this[e](ev.target.id,ev) ) )
      this.reactToNetwork()
      $menu.buttons = ([
        `<a class="btn" aria-label="button" aria-title="connect button" aria-description="use this to talk or chat with other people" id="meeting" onclick="$connections.show()"><i class="gg-user-add"></i>&nbsp;connect</a><br>`
      ]).concat($menu.buttons)

      if( document.location.href.match(/meet=/) ) this.show()

      setTimeout( () => document.dispatchEvent( new CustomEvent("$connections:ready", {detail: opts}) ), 1 )
    },

    toggle(){
      $chat.visible = !$chat.visible 
    },

    change(id,e){
      if( id.match(/^(webcam|chatnetwork|scene)$/) ){
        this.renderSettings() // trigger this when 'change' event fires on children dom elements
      }
    },

    show(opts){
      opts = opts || {}
      if( opts.hide ){
        if( el.parentElement ) el.parentElement.parentElement.style.display = 'none' // hide along with wrapper elements
        if( !opts.showChat ) $chat.visible = false
      }else{
        $chat.visible = true
        this.visible  = true
        // hide networking settings if entering thru meetinglink
        $networking.style.display = document.location.href.match(/meet=/) ? 'none' : 'block'
        if( !network.connected ){
            document.querySelector('body > .xrf').appendChild(el)
            $chat.send({message:"", el, class:['ui']})
            if( !network.meetinglink ){ // set default
              $webcam.value      = opts.webcam      || 'Peer2Peer'
              $chatnetwork.value = opts.chatnetwork || 'Peer2Peer'
              $scene.value       = opts.scene       || 'Peer2Peer'
            }
            this.renderSettings()
        }else{
          $chat.send({message:"you are already connected, refresh page to create new connection",class:['info']})
        }
      }
    },

    update(){
      this.selectedWebcam      = $webcam.value
      this.selectedChatnetwork = $chatnetwork.value
      this.selectedScene       = $scene.value
    },

    forSelectedPluginsDo(cb){
      // this function looks weird but it's handy to prevent the same plugins rendering duplicate configurations
      let plugins = {}
      let select = (name) => (o) => o.profile.name == name ? plugins[ o.profile.name ] = o : ''
      this.webcam.find( select(this.selectedWebcam) )
      this.chatnetwork.find( select(this.selectedChatnetwork) )
      this.scene.find( select(this.selectedScene) )
      for( let i in plugins ){
        try{ cb(plugins[i]) }catch(e){ console.error(e) }
      }
    },

    renderSettings(){
      let opts = {webcam: $webcam.value, chatnetwork: $chatnetwork.value, scene: $scene.value }
      this.update()
      $settings.innerHTML = ''
      this.forSelectedPluginsDo( (plugin) => $settings.appendChild( plugin.config({...opts,plugin}) ) )
      this.renderInputs()
    },

    renderInputs(){
      if( !this.selectedWebcam || this.selectedWebcam == 'No thanks' ){
        return this.$devices.style.display = 'none' 
      }else this.$devices.style.display = ''

      navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
      })
      .then( () => {

        const selectors = [this.$audioInput, this.$audioOutput, this.$videoInput];

        const gotDevices = (deviceInfos) => {
          // Handles being called several times to update labels. Preserve values.
          const values = selectors.map(select => select.value);
          selectors.forEach(select => {
            while (select.firstChild) {
              select.removeChild(select.firstChild);
            }
          });
          for (let i = 0; i !== deviceInfos.length; ++i) {
            const deviceInfo = deviceInfos[i];
            const option = document.createElement('option');
            option.value = deviceInfo.deviceId;
            if (deviceInfo.kind === 'audioinput') {
              option.text = deviceInfo.label || `microphone ${this.$audioInput.length + 1}`;
              this.$audioInput.appendChild(option);
            } else if (deviceInfo.kind === 'audiooutput') {
              option.text = deviceInfo.label || `speaker ${this.$audioOutput.length + 1}`;
              this.$audioOutput.appendChild(option);
            } else if (deviceInfo.kind === 'videoinput') {
              option.text = deviceInfo.label || `camera this.${this.$videoInput.length + 1}`;
              this.$videoInput.appendChild(option);
            } else {
              console.log('Some other kind of source/device: ', deviceInfo);
            }
          }
          // hide if there's nothing to choose
          let totalDevices = this.$audioInput.options.length + this.$audioOutput.options.length + this.$videoInput.options.length
          this.$devices.style.display = totalDevices > 3 ? 'block' : 'none'

          selectors.forEach((select, selectorIndex) => {
            if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {
              select.value = values[selectorIndex];
            }
          });
        }
        // after getUserMedia we can enumerate
        navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(console.warn);
      })
    },

    reactToNetwork(){ // *TODO* move to network?

      document.addEventListener('network.connect',    () => {
        this.show({hide:true, showChat: true})
      })
      document.addEventListener('network.disconnect',    () => {
        this.connected = false 
      })

    }

  },{

    get(data,k,v){ return data[k] },
    set(data,k,v){ 
      data[k] = v 
      switch( k ){
        case "visible":             el.style.display = v ? '' : 'none'; break;
        case "webcam":              $webcam.innerHTML       = `<option>${data[k].map((p)=>p.profile.name).join('</option><option>')}</option>`; break;
        case "chatnetwork":         $chatnetwork.innerHTML  = `<option>${data[k].map((p)=>p.profile.name).join('</option><option>')}</option>`; break;
        case "scene":               $scene.innerHTML        = `<option>${data[k].map((p)=>p.profile.name).join('</option><option>')}</option>`; break;
        case "selectedScene":       $scene.value       = v; data.renderSettings(); break;
        case "selectedChatnetwork": $chatnetwork.value = v; data.renderSettings(); break;
        case "selectedWebcam":      {
                                        $webcam.value      = v; 
                                        data.renderSettings(); 
                                        $devices.style.display = v ? 'block' : 'none'
                                        break;
                                    }

      } 
    }

  })
}

// reactify component!
document.addEventListener('$menu:ready', (opts) => {
  opts = opts.detail
  document.head.innerHTML += connectionsComponent.css 
  window.$connections = document.createElement('div')
  $connections.innerHTML = connectionsComponent.html
  $connections = connectionsComponent.init($connections)
  $connections.install(opts)
})

// alpine component for displaying meetings

connectionsComponent.css = `
    <style type="text/css">
      button#connect{
        height: 43px;
        width:100%;
        margin: 0px;
      }
      #messages .msg #connections{
        position:relative;
      }
      .connecthide {
        transform:translateY(-1000px);
      }
      #close{
        display: block;
        position: relative;
        float: right;
        top: 16px;
      }
      #messages .msg.ui  div.tab-frame > div.tab{ padding:25px 10px 5px 10px;}
   </style>`
chatComponent = {

  html: `
    <div id="chat">
     <div id="videos" style="pointer-events:none"></div>
     <div id="messages" aria-live="assertive" aria-relevant></div>
     <div id="chatfooter">
       <div id="chatbar">
           <input id="chatline" type="text" placeholder="chat here"></input>
       </div>
       <button id="showchat" class="btn">show chat</button>
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

    initListeners(){
      let {$chatline} = this

      $chatline.addEventListener('click', (e) => this.inform() )

      $chatline.addEventListener('keydown', (e) => {
        if (e.key == 'Enter' ){
          if( $chatline.value[0] != '/' ){
            document.dispatchEvent( new CustomEvent("network.send", {detail: {message:$chatline.value}} ) )
          }
          this.send({message: $chatline.value })
          $chatline.value = ''
          if( window.innerHeight < 600 ) $chatline.blur()
        }
      })

      document.addEventListener('network.connect', (e) => {
        this.visible = true
        this.$chatbar.style.display = '' // show
      })

      document.addEventListener('network.connected', (e) => {
        if( e.detail.username ) this.username = e.detail.username
      })

    },

    inform(){
      if( !this.inform.informed && (this.inform.informed = true) ){
        window.notify("Connected via P2P. You can now type message which will be visible to others.")
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
      if( !msg.className.match(/(info|guide|ui)/) ){
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
       /*
       display: flex;
       flex-direction: column;
       width: 91%;
       max-width: 500px;
       */
       width:100%;
       align-items: flex-start;
       position: absolute;
       transition:1s;
       top: 77px;
       left: 0;
       bottom: 49px;
       padding: 20px;
       overflow:hidden;
       overflow-y: scroll;
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
       pointer-events:none;
       -webkit-user-select:none;
       -moz-user-select:-moz-none;
       -ms-user-select:none;
       user-select:none;
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
     #messages .msg *{
       pointer-events:all;
       -webkit-user-select:text;
       -moz-user-select:-moz-text;
       -ms-user-select:text;
       user-select:text;
    }

     #messages .msg.self{
       border-radius: 20px;
       background:var(--xrf-box-shadow);
     }
     #messages .msg.self,
     #messages .msg.self div{
       color:#FFF;
     }
     #messages .msg.info{
       background: #473f7f;
       border-radius: 20px;
       color: #FFF;
       text-align: right;
       line-height: 19px;
     }
     #messages .msg.info,
     #messages .msg.info *{
       font-size: var(--xrf-font-size-0);
     }
     #messages .msg a {
       text-decoration:underline;
       color: var(--xrf-primary);
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

    .envelope,
    .envelope * {
      overflow:hidden;
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
   </style>`
}).apply({})
