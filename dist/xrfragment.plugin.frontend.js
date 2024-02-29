(function(){
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
        let frag = xrf.URI.parse(document.location.hash)
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
// reactive component for displaying the menu 
menuComponent = (el) => new Proxy({

  html: `
    <div class="xrf footer">
      <div class="menu">
        <div id="buttons"></div>
        <a class="btn" id="more" aria-title="menu button"><i id="icon" class="gg-menu"></i></a><br>
      </div>
    </div>
  `,

  collapsed:    false,
  logo:       './../../assets/logo.png',
  buttons:    [`<a class="btn" aria-label="button" aria-title="share button" aria-description="this allows embedding and sharing of this URL or make a screenshot of it"  id="share"   onclick="frontend.share()"><i class="gg-link"></i>&nbsp;share</a><br>`],
  $buttons:   $buttons = el.querySelector('#buttons'),
  $btnMore:   $btnMore = el.querySelector('#more'),

  toggle(state){   
    this.collapsed = state !== undefined ? state : !this.collapsed 
    el.querySelector("i#icon").className = this.collapsed ? 'gg-close' : 'gg-menu'
    document.body.classList[ this.collapsed ? 'add' : 'remove' ](['menu'])
  },

  init(opts){
    el.innerHTML = this.html
    document.body.appendChild(el);
    (['click']).map( (e) => el.addEventListener(e, (ev) => this[e] && this[e](ev.target.id,ev) ) )
    setTimeout( () => {
      document.dispatchEvent( new CustomEvent("$menu:ready", {detail: {$menu:this,xrf}}) )
    },100)
    return this
  },

  click(id,e){
    switch(id){
      case "icon":
      case "more": this.toggle(); break;
    }
  }
},
{

  get(me,k,v){ return me[k] },

  set(me,k,v){ 
    me[k] = v    
    switch( k ){
      case "buttons":    el.querySelector("#buttons").innerHTML = this.renderButtons(me); 
                         document.dispatchEvent( new CustomEvent("$menu:buttons:render", {detail: el.querySelector('.menu') }) )
                         break;
      case "collapsed":  
                         el.querySelector("#buttons").style.display = me.collapsed ? 'block' : 'none'
                         frontend.emit('$menu:collapse', v)
                         break;
    }
  },

  renderButtons: (data) => `${data.buttons.join('')}`

})

// reactify component!
document.addEventListener('frontend:ready', (e) => {
  window.$menu = menuComponent( document.createElement('div') ).init(e.detail)
})
window.accessibility = (opts) => new Proxy({
  opts,

  enabled: false,

  // features
  speak_movements: true,
  speak_keyboard: true,

  // audio settings
  speak_rate: 1,
  speak_pitch: 1,
  speak_volume: 1,
  speak_voice: -1,

  toggle(){ this.enabled = !this.enabled },

  settings(){
    this.toggle() // *TODO* should show settings screen 
  },

  speak(str, opts){
    opts = opts || {speaksigns:true}
    if( !this.enabled || !str) return
    if( opts.speaksigns ){
      str = str.replace(/\/\//,' ')
               .replace(/:/,'')
               .replace(/\//,' slash ')
               .replace(/\./,' dot ')
               .replace(/#/,' hash ')
               .replace(/&/,' and ')
               .replace(/=/,' is ')
    }
    let speech = window.speechSynthesis
    let utterance = new SpeechSynthesisUtterance( str )
    if( this.speak_voice != -1) utterance.voice  = speech.getVoices()[ this.speak_voice ];
    else{
      let voices = speech.getVoices()
      for(let i = 0; i < voices.length; i++ ){
        if( voices[i].lang == navigator.lang ) this.speak_voice = i;
      }
    }
    utterance.rate   = this.speak_rate
    utterance.pitch  = this.speak_pitch
    utterance.volume = this.speak_volume
    if( opts.override ) speech.cancel() 
    speech.speak(utterance)
  },

  init(){

    window.addEventListener('keydown', (e) => {
      if( !this.speak_keyboard ) return
      let k = e.key
      switch(k){
        case "ArrowUp":    k = "forward";  break;
        case "ArrowLeft":  k = "left";     break;
        case "ArrowRight": k = "right";    break;
        case "ArrowDown":  k = "backward"; break;
      } 
      this.speak(k,{override:true})
    })

    document.addEventListener('$menu:buttons:render', (e) => {
      let $    = e.detail
      let a = [...$.querySelectorAll('a')]
      // make sure anchor buttons are accessible by tabbing to them 
      a.map( (btn) => {
        if( !btn.href ) btn.setAttribute("href","javascript:void(0)") // important!
        btn.setAttribute("aria-label","button")
      })
      document.addEventListener('mouseover', (e) => {
        if( e.target.getAttribute("aria-title") ){
          let lines = []
          lines.push( e.target.getAttribute("aria-title") )
          lines.push( e.target.getAttribute("aria-description") )
          lines = lines.filter( (l) => l )
          this.speak( lines.join("."), {override:true,speaksigns:false} )
        }
      })
    })

    document.addEventListener('network.send', (e) => {
      let opts = e.detail
      opts.message = opts.message || ''
      this.speak(opts.message)
    })

    opts.xrf.addEventListener('pos', (opts) => {
      if( this.enabled ){
        $chat.send({message: this.posToMessage(opts) })
        network.send({message: this.posToMessage(opts), class:["info","guide"]})
      }
      if( opts.frag.pos.string.match(/,/) ){
        network.pos = opts.frag.pos.string
      }else{
        network.posName = opts.frag.pos.string
      }
    })

  },

  posToMessage(opts){
    let obj
    let description
    let msg = "teleported to "
    let pos = opts.frag.pos
    if( pos.string.match(',') ) msg += `coordinates <a href="#pos=${pos.string}">${pos.string}</a>`
    else{
      msg += `location <a href="#pos=${pos.string}">${pos.string}</a>`
      obj = opts.scene.getObjectByName(pos.string)
      if( obj ){
        description = obj.userData['aria-label'] || ''
      }else msg += ", but the teleportation was refused because it cannot be found within this world"      
    } 
    return msg
  },

  sanitizeTranscript(){
    return $chat.$messages.innerText
           .replaceAll("<[^>]*>", "") // strip html
           .split('\n')
           .map( (l) => String(l+'.').replace(/(^|:|;|!|\?|\.)\.$/g,'\$1') ) // add dot if needed
           .join('\n')
  }

},
{ 
  // auto-trigger events on changes 
  get(data,k,receiver){ return data[k] },
  set(data,k,v){ 
    data[k] = v 
    switch( k ){
      case "enabled": {
                        let message = "accessibility has been"+(v?"boosted":"lowered")
                        $('#accessibility.btn').style.filter= v ? 'brightness(1.0)' : 'brightness(0.5)'
                        if( v ) $chat.visible = true
                        $chat.send({message,class:['info','guide']})
                        data.enabled = true
                        data.speak(message)
                        data.enabled = v
                        $chat.$messages.classList[ v ? 'add' : 'remove' ]('guide')
                        if( !data.readTranscript && (data.readTranscript = true) ){
                          data.speak( data.sanitizeTranscript() )
                        }
                      }
    }
  }
})

document.addEventListener('$menu:ready', (e) => {
  try{
    accessibility = accessibility(e.detail) 
    accessibility.init()
    document.dispatchEvent( new CustomEvent("accessibility:ready", e ) )
    $menu.buttons = $menu.buttons.concat([`<a class="btn" style="background:var(--xrf-dark-gray);filter: brightness(0.5);" aria-label="button" aria-description="enable all accessibility features" id="accessibility" onclick="accessibility.settings()"><i class="gg-yinyang"></i>accessibility</a><br>`])
  }catch(e){console.error(e)}
})
document.head.innerHTML += `
  <style type="text/css">
    :root {
        --xrf-primary: #6839dc;
        --xrf-primary-fg: #FFF;
        --xrf-light-primary: #ea23cf;
        --xrf-secondary: #872eff;
        --xrf-light-xrf-secondary: #ce7df2;
        --xrf-topbar-bg: #fffb;
        --xrf-box-shadow: #0005;
        --xrf-red: red;
        --xrf-dark-gray: #343334;
        --xrf-gray: #424280;
        --xrf-white: #fdfdfd;
        --xrf-light-gray: #efefef;
        --xrf-lighter-gray: #e4e2fb96;
        --xrf-font-sans-serif: system-ui, -apple-system, segoe ui, roboto, ubuntu, helvetica, cantarell, noto sans, sans-serif;
        --xrf-font-monospace: menlo, monaco, lucida console, liberation mono, dejavu sans mono, bitstream vera sans mono, courier new, monospace, serif;
        --xrf-font-size-0: 12px;
        --xrf-font-size-1: 14px;
        --xrf-font-size-2: 17px;
        --xrf-font-size-3: 21px;
    }

    /* CSS reset */
    html{line-height:1.15;-webkit-text-size-adjust:100%}body{margin:0}main{display:block}h1{font-size:2em;margin:0.67em 0}hr{box-sizing:content-box;height:0;overflow:visible}pre{font-family:monospace, monospace;font-size:1em}a{background-color:transparent}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}b,strong{font-weight:bolder}code,kbd,samp{font-family:monospace, monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-0.25em}sup{top:-0.5em}img{border-style:none}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0}button,input{overflow:visible}button,select{text-transform:none}[type="button"],[type="reset"],[type="submit"],button{-webkit-appearance:button}[type="button"]::-moz-focus-inner,[type="reset"]::-moz-focus-inner,[type="submit"]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type="button"]:-moz-focusring,[type="reset"]:-moz-focusring,[type="submit"]:-moz-focusring,button:-moz-focusring{outline:1px dotted ButtonText}fieldset{padding:0.35em 0.75em 0.625em}legend{box-sizing:border-box;color:inherit;display:table;max-width:100%;padding:0;white-space:normal}progress{vertical-align:baseline}textarea{overflow:auto}[type="checkbox"],[type="radio"]{box-sizing:border-box;padding:0}[type="number"]::-webkit-inner-spin-button,[type="number"]::-webkit-outer-spin-button{height:auto}[type="search"]{-webkit-appearance:textfield;outline-offset:-2px}[type="search"]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}details{display:block}summary{display:list-item}template{display:none}[hidden]{display:none}

    .xrf table tr td{
      vertical-align:top;
    }
    .xrf button,
    .xrf input[type="submit"],
    .xrf .btn {
      text-decoration:none;
      background: var(--xrf-primary);
      border: 0;
      border-radius: 25px;
      padding: 11px 15px;
      font-weight: bold;  
      transition: 0.3s;
      height: 40px;
      font-size: var(--xrf-font-size-1);
      color: var(--xrf-primary-fg);
      line-height: var(--xrf-font-size-1);
      cursor:pointer;
      white-space:pre;
      min-width: 45px;
      box-shadow: 0px 0px 10px var(--xrf-box-shadow);
      display:inline-block;
    }

    .xrf button:hover,
    .xrf input[type="submit"]:hover,
    .xrf .btn:hover {
      background: var(--xrf-secondary);
      text-decoration:none;
    }

    .xrf, .xrf *{
      font-family: var(--xrf-font-sans-serif);
      font-size: var(--xrf-font-size-1);
      line-height:27px;
    }

    textarea, select, input[type="text"] {
      background: transparent; /* linear-gradient( var(--xrf-lighter-gray), var(--xrf-gray) ) !important; */
    }

    input[type="submit"] {
      color: var(--xrf-light-gray);
    }

    input[type=text]{
      padding:7px 15px;
    }
    input{
      border-radius:7px;
      margin:5px 0px;
    }

    .title {
      border-bottom: 2px solid var(--xrf-secondary);
      padding-bottom: 20px;
    }

    #topbar{
      background: var(--xrf-topbar-bg);
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 48px;
      box-shadow: 0px 0px 10px var(--xrf-box-shadow);
      opacity: 0.9;
      z-index:2000;
      display:none;
    }

    #topbar .logo{
      width: 92px;
      position: absolute;
      top: 9px;
      left: 93px;
      height: 30px;
      background-size: contain;
      background-repeat: no-repeat;
    }

    #topbar > input[type="submit"] {
      height: 32px;
      position: absolute;
      right: 20px;
      top: 2px;
      min-width:135px;
    }

    #topbar > button#navback,
    #topbar > button#navforward {
      height: 32px;
      font-size: 24px;
      position: absolute;
      left: 9px;
      padding: 2px 13px;
      border-radius:6px;
      top: 8px;
      color: var(--xrf-light-gray);
      width: 36px;
      min-width: unset;
    }
    #topbar > button#navforward {
      left:49px;
    }

    #topbar > #uri {
        height: 18px;
        font-size: var(--xrf-font-size-3);
        position: absolute;
        left: 200px;
        top: 9px;
        max-width: 550px;
        padding: 5px 0px 5px 5px;
        width: calc( 63% - 200px);
        background: #f0f0f0;
        border-color: #Ccc;
        border: 2px solid #CCC;
        border-radius: 7px;
        color: #555;
    }



    .footer > .menu .btn{
      display:inline-block;
      background: var(--xrf-primary);
      border-radius: 25px;
      border: 0;
      padding: 5px 19px;
      font-weight: 1000;
      font-family: sans-serif;
      font-size: var(--xrf-font-size-2);
      color:var(--xrf-primary-fg);
      height:33px;
      z-index:2000;
      cursor:pointer;
      min-width:145px;
      text-decoration:none;
      margin-top: 15px;
      line-height:36px;
      margin-right:10px;
      text-align:left;
    }

    .xrf a.btn#more{
      z-index:3000;
      width: 19px;
      min-width: 19px;
      font-size:16px;
      text-align: center;
      background:white;
      color: var(--xrf-primary);
    }
    .xrf a.btn#more i.gg-menu{
      margin-top:15px;
    }
    .xrf a.btn#more i.gg-close,
    .xrf a.btn#more i.gg-menu{
      color:#888;
    }
    .xrf a.btn#meeting i.gg-user-add{
      margin-right: 12px;
    }

    .xrf a.btn#share i.gg-link{
      margin-right:24px;
    }

    .xrf a.btn#accessibility i.gg-yinyang{
      margin-right:13px;
    }

    html{
      max-width:unset;
    }

    .render {
      position:absolute;
      top:0;
      left:0;
      right:0;
      bottom:0;
    }

    .lil-gui.autoPlace{
      right:0px !important;
      top:48px !important;
      height:33vh;
    }

    #VRButton {
      margin-bottom:20vh;
    }

    @media (max-width: 450px) {
      #uri{ display:none; }
    }

    @media (max-width: 640px) {
      .lil-gui.root{
        top:auto !important;
        left:auto !important;
      }
      .js-snackbar__message{
        overflow-y:auto;
        max-height:600px;
      }
      .js-snackbar__message h1,h2,h3{
        font-size:22px;
      }
      .xrf table tr td {
    
      }
      :root{
        --xrf-font-size-1: 13px;
        --xrf-font-size-2: 17px;
        --xrf-font-size-3: 20px;
      }
    }


    .a-enter-vr-button, .a-enter-ar-button{
      height:41px;
    }

    #qrcode{
      background: transparent;
      overflow: hidden;
      height: 121px;
      display: inline-block;
      position: relative;
    }

    input#share{
      font-size: var(--xrf-font-size-1);
      font-family: var(--xrf-font-monospace);
      border:2px solid #AAA;
      width:50vw;
      max-width:400px;
    }

    .footer {
      z-index:1000;
      display: flex;
      flex-direction: column-reverse; /* This reverses the stacking order of the flex container */
      align-items: flex-end;
      height: 100%;
      position: fixed;
      top: 71px;
      right: 11px;
      bottom: 0;
      padding-bottom:140px;
      box-sizing:border-box;
      pointer-events:none;
    }
    .footer *{
      pointer-events:all;
    }
    .footer .menu{
      text-align:right;
    }

    .badge,
    #messages .msg.ui div.badge{
      box-sizing:border-box;
      display:inline-block;
      color: var(--xrf-white);
      font-weight: bold;
      background: var(--xrf-dark-gray);
      border-radius:16px;
      padding:0px 12px;
      font-size: var(--xrf-font-size-0);
      margin-right:10px;
      text-decoration:none !important;
    }
    #messages .msg.ui div.badge a{
      color:#FFF;
    }

    .ruler{
      width:97%; 
      margin:7px 0px;
    }


    a.badge {
      text-decoration:none;
    }

    .xrf select{
      border-inline: none;
      border-inline: none;
      border-block: none;
      border: 3px solid var(--xrf-primary);
      border-radius: 5px;
      background: none;
      border-radius:30px;
    }
    .xrf select,
    .xrf option{
      padding: 0px 16px;
      min-width: 150px;
      max-width: 150px;
      height: 35px;
    }

    .xrf input{
      border-radius:30px;
      padding: 7px 15px;
      border-block: none;
      border-inline: none;
      border: 1px solid #888;
      background: transparent;
      max-width:105px;
    }

    .xrf table tr td {
      vertical-align:middle;
      text-align:right;
    }
    .xrf table tr td:nth-child(1){
      min-width:82px;
      height:40px;
      padding-right:15px;
    }

    .xrf small{
      font-size: var(--xrf-font-size-0);
    }
    .disabled{
      opacity:0.5
    }

  body.menu .js-snackbar__wrapper {
    top: 64px; 
  }

  .transcript{
    max-height:105px;
    max-width:405px;
    overflow-y:auto;
    border: 1px solid var(--xrf-gray);
    border-radius: 5px;
    padding: 10px;
  }

  .right { float:right }
  .left  { float:left  }

  /*
   * tabs 
   */ 
  div.tab-frame > input{ display:none;}
  div.tab-frame > label{ display:block; float:left;padding:5px 10px; cursor:pointer;  }
  div.tab-frame > input:checked + label{ cursor:default; border-bottom:1px solid #888; font-weight:bold; }
  div.tab-frame > div.tab{ display:none; padding:15px 10px 5px 10px;clear:left}

  div.tab-frame > input:nth-of-type(1):checked ~ .tab:nth-of-type(1),
  div.tab-frame > input:nth-of-type(2):checked ~ .tab:nth-of-type(2),
  div.tab-frame > input:nth-of-type(3):checked ~ .tab:nth-of-type(3){ display:block;}


  /*
   * css icons from https://css.gg
   */

  .gg-close-o {
      box-sizing: border-box;
      position: relative;
      display: block;
      transform: scale(var(--ggs,1));
      width: 22px;
      height: 22px;
      border: 2px solid;
      border-radius: 40px
  }
  .gg-close-o::after,
  .gg-close-o::before {
      content: "";
      display: block;
      box-sizing: border-box;
      position: absolute;
      width: 12px;
      height: 2px;
      background: currentColor;
      transform: rotate(45deg);
      border-radius: 5px;
      top: 8px;
      left: 3px
  }
  .gg-close-o::after {
      transform: rotate(-45deg)
  }

  .gg-user-add {
      display: inline-block;
      transform: scale(var(--ggs,1));
      box-sizing: border-box;
      width: 20px;
      height: 18px;
      background:
          linear-gradient(
              to left,
              currentColor 8px,
              transparent 0)
              no-repeat 14px 6px/6px 2px,
          linear-gradient(
              to left,
              currentColor 8px,
              transparent 0)
              no-repeat 16px 4px/2px 6px
  }
  .gg-user-add::after,.gg-user-add::before {
      content: "";
      display: block;
      box-sizing: border-box;
      position: absolute;
      border: 2px solid
  }
  .gg-user-add::before {
      width: 8px;
      height: 8px;
      border-radius: 30px;
      top: 0;
      left: 2px
  }
  .gg-user-add::after {
      width: 12px;
      height: 9px;
      border-bottom: 0;
      border-top-left-radius: 3px;
      border-top-right-radius: 3px;
      top: 9px
  }

  .gg-user {
      display: inline-block;
      transform: scale(var(--ggs,1));
      box-sizing: border-box;
      width: 12px;
      height: 18px
  }
  .gg-user::after,
  .gg-user::before {
      content: "";
      display: block;
      box-sizing: border-box;
      position: absolute;
      border: 2px solid
  }
  .gg-user::before {
      width: 8px;
      height: 8px;
      border-radius: 30px;
      top: 0;
      left: 2px
  }
  .gg-user::after {
      width: 12px;
      height: 9px;
      border-bottom: 0;
      border-top-left-radius: 3px;
      border-top-right-radius: 3px;
      top: 9px
  }

  .gg-menu {
      transform: scale(var(--ggs,1))
  }
  .gg-menu,
  .gg-menu::after,
  .gg-menu::before {
      box-sizing: border-box;
      position: relative;
      display: block;
      width: 20px;
      height: 2px;
      border-radius: 3px;
      background: currentColor
  }
  .gg-menu::after,
  .gg-menu::before {
      content: "";
      position: absolute;
      top: -6px
  }
  .gg-menu::after {
      top: 6px
  }

  .gg-close {
      box-sizing: border-box;
      position: relative;
      display: block;
      transform: scale(var(--ggs,1)) scale(var(--ggs,1)) translate(-2px,5px);
      width: 22px;
      height: 22px;
      border: 2px solid transparent;
      border-radius: 40px
  }
  .gg-close::after,
  .gg-close::before {
      content: "";
      display: block;
      box-sizing: border-box;
      position: absolute;
      width: 16px;
      height: 2px;
      background: currentColor;
      transform: rotate(45deg);
      border-radius: 5px;
      top: 8px;
      left: 1px
  }
  .gg-close::after {
      transform: rotate(-45deg)
  }

  .gg-link {
      box-sizing: border-box;
      position: relative;
      display: inline-block;
      -moz-transform: rotate(-45deg) scale(var(--ggs,1));
      transform: translate(4px,-5px) rotate(-45deg) scale(var(--ggs,1));
      width: 8px;
      height: 2px;
      background: currentColor;
      line-height:11px;
      border-radius: 4px
  }
  .gg-link::after,
  .gg-link::before {
      content: "";
      display: block;
      box-sizing: border-box;
      position: absolute;
      border-radius: 3px;
      width: 8px;
      height: 10px;
      border: 2px solid;
      top: -4px
  }
  .gg-link::before {
      border-right: 0;
      border-top-left-radius: 40px;
      border-bottom-left-radius: 40px;
      left: -6px
  }
  .gg-link::after {
      border-left: 0;
      border-top-right-radius: 40px;
      border-bottom-right-radius: 40px;
      right: -6px
  }

  .gg-info {
      box-sizing: border-box;
      position: relative;
      display: inline-block;
      transform: scale(var(--ggs,1)) translate(-3px, 3px);
      width: 20px;
      height: 20px;
      border: 2px solid;
      border-radius: 40px
  }
  .gg-info::after,
  .gg-info::before {
      content: "";
      display: block;
      box-sizing: border-box;
      position: absolute;
      border-radius: 3px;
      width: 2px;
      background: currentColor;
      left: 7px
  }
  .gg-info::after {
      bottom: 2px;
      height: 8px
  }
  .gg-info::before {
      height: 2px;
      top: 2px
  }

  .gg-yinyang {
    box-sizing: border-box;
    position: relative;
    display: inline-block;
    transform: rotate(95deg) scale(var(--ggs,1)) translate(4px,4px); 
    width: 20px;
    height: 20px;
    border: 2px solid;
    border-radius: 22px
  }
  .gg-yinyang::after,
  .gg-yinyang::before {
    content: "";
    display: block;
    box-sizing: border-box;
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 10px;
    top: 4px
  }
  .gg-yinyang::before {
    border: 2px solid;
    left: 0
  }
  .gg-yinyang::after {
    border: 2px solid transparent;
    right: 0;
    box-shadow:
      inset 0 0 0 4px,
      0 -3px 0 1px,
      -2px -4px 0 1px,
      -8px -5px 0 -1px,
      -11px -3px 0 -2px,
      -12px -1px 0 -3px,
      -6px -6px 0 -1px
  }

  .gg-image {
      box-sizing: border-box;
      position: relative;
      display: inline-block;
      transform: scale(var(--ggs,1)) translate(1px,2px); 
      width: 20px;
      height: 16px;
      overflow: hidden;
      box-shadow: 0 0 0 2px;
      border-radius: 2px
  }
  .gg-image::after,
  .gg-image::before {
      content: "";
      display: block;
      box-sizing: border-box;
      position: absolute;
      border: 2px solid
  }
  .gg-image::after {
      transform: rotate(45deg);
      border-radius: 3px;
      width: 16px;
      height: 16px;
      top: 9px;
      left: 6px
  }
  .gg-image::before {
      width: 6px;
      height: 6px;
      border-radius: 100%;
      top: 2px;
      left: 2px
  }
  .gg-serverless {
      box-sizing: border-box;
      position: relative;
      display: inline-block;
      transform: scale(var(--ggs,1)) translate(2px,1px); 
      width: 15px;
      height: 13px;
      overflow: hidden
  }
  .gg-serverless::after,
  .gg-serverless::before {
      background: currentColor;
      content: "";
      box-sizing: border-box;
      position: absolute;
      display: block;
      height: 3px;
      box-shadow: 0 5px 0,0 10px 0;
      transform: skew(-20deg)
  }
  .gg-serverless::before {
      width: 8px;
      left: -2px
  }
  .gg-serverless::after {
      width: 12px;
      right: -5px
  }
  .gg-software-download {
      box-sizing: border-box;
      position: relative;
      display: inline-block;
      transform: scale(var(--ggs,1)) translate(3px,3px); 
      width: 16px;
      height: 6px;
      border: 2px solid;
      border-top: 0;
      border-bottom-left-radius: 2px;
      border-bottom-right-radius: 2px;
      line-height:15px;
  }
  .gg-software-download::after {
      content: "";
      display: block;
      box-sizing: border-box;
      position: absolute;
      width: 8px;
      height: 8px;
      border-left: 2px solid;
      border-bottom: 2px solid;
      transform: rotate(-45deg);
      left: 2px;
      bottom: 4px
  }
  .gg-software-download::before {
      content: "";
      display: block;
      box-sizing: border-box;
      position: absolute;
      border-radius: 3px;
      width: 2px;
      height: 10px;
      background: currentColor;
      left: 5px;
      bottom: 5px
  }
  .gg-arrow-left-r {
      box-sizing: border-box;
      position: relative;
      display: inline-block;
      width: 22px;
      height: 22px;
      border: 2px solid;
      transform: scale(var(--ggs,1));
      border-radius: 4px
  }
  .gg-arrow-left-r::after,
  .gg-arrow-left-r::before {
      content: "";
      display: block;
      box-sizing: border-box;
      position: absolute;
      left: 4px
  }
  .gg-arrow-left-r::after {
      width: 6px;
      height: 6px;
      border-bottom: 2px solid;
      border-left: 2px solid;
      transform: rotate(45deg);
      bottom: 6px
  }
  .gg-arrow-left-r::before {
      width: 10px;
      height: 2px;
      bottom: 8px;
      background: currentColor
  }
  </style>
`
// this has some overlap with $menu.js
// frontend serves as a basis for shared functions (download, share e.g.)

window.frontend = (opts) => new Proxy({

  html: `
    <div id="topbar" class="xrf">
      <div class="logo" ></div>
      <button id="navback"  onclick="history.back()">&#8249;</button>
      <button id="navforward" onclick="history.forward()">&#8250;</button>
      <input id="load" type="submit" value="load 3D file"></input>
      <input type="text" id="uri" value="" onchange="AFRAME.XRF.navigator.to( $('#uri').value )" style="display:none"/>
    </div>
  `,
  el:   null,
  plugin: {},
  xrf,

  // this SUPER-emit forwards custom events to all objects supporting dispatchEvent
  // perfect to broadcast events simultaniously to document + 3D scene
  emit(k,v){
    v = v || {event:k}
    for( let i in opts ){
      if( opts[i].dispatchEvent ){
        if( opts.debug ) console.log(`${i}.emit(${k},{...})`)
        opts[i].dispatchEvent( new CustomEvent(k,{detail:v}) )
      }
    }
  },

  init(){

    // setup element and delegate events
    this.el = document.createElement("div")
    this.el.innerHTML = this.html
    document.body.appendChild(this.el);
    (['click']).map( (e) => this.el.addEventListener(e, (ev) => this[e] && this[e](ev.target.id,ev) ) )

    this
    .setupFileLoaders()
    .setupIframeUrlHandler()
    .setupCapture()
    .setupUserHints()
    .setupNetworkListeners()
    .hidetopbarWhenMenuCollapse()
    .hideUIWhenNavigating()

    window.notify   = this.notify
    setTimeout( () => {
      document.dispatchEvent( new CustomEvent("frontend:ready", {detail:opts} ) )
    },1)
    return this
  },

  click(id,ev){
    switch( id ){
      case "load": this.fileLoaders()
    }
  },

  setupFileLoaders(){
    // enable user-uploaded asset files (activated by load button)
    this.fileLoaders = this.loadFile({
      ".gltf": (file) => file.arrayBuffer().then( (data) => xrf.navigator.to(file.name,null, (new xrf.loaders.gltf()), data) ),
      ".glb":  (file) => file.arrayBuffer().then( (data) => xrf.navigator.to(file.name,null, (new xrf.loaders.gltf()), data) )
    })
    return this
  },

  setupIframeUrlHandler(){
    // allow iframe to open url
    window.addEventListener('message', (event) => {
      if (event.data && event.data.url) {
        window.open(event.data.url, '_blank');
      }
    });
    return this
  },

  setupCapture(){
    // add screenshot component with camera to capture bigger size equirects
    // document.querySelector('a-scene').components.screenshot.capture('perspective')
    $('a-scene').setAttribute("screenshot",{camera: "[camera]",width: 4096*2, height:2048*2})
    return this
  },

  setupUserHints(){
    // notify navigation + href mouseovers to user
    setTimeout( () => {
      window.notify('loading '+document.location.search.substr(1))

      setTimeout( () => {
        window.notify("use WASD-keys and mouse-drag to move around",{timeout:false})
        xrf.addEventListener('navigate', () => SnackBar() ) // close dialogs when url changes
      },2000 )

      xrf.addEventListener('href', (data) => {
        if( !data.selected  ) return

        let html     = `<b class="badge">${data.mesh.isSRC && !data.mesh.portal ? 'src' : 'href'}</b>${ data.xrf ? data.xrf.string : data.mesh.userData.src}<br>`
        let metadata = data.mesh.userData
        let meta     = xrf.Parser.getMetaData()

        let hasMeta = false
        for ( let label in meta ) {
          let fields = meta[label]
          for ( let i = 0; i < fields.length;i++ ) {
            let field = fields[i]
            if( metadata[field] ){
              hasMeta = true
              html += `<br><b style="min-width:110px;display:inline-block">${label}:</b> ${metadata[field]}\n`
              break
            }
          }
        }
        let transcript = ''
        let root = data.mesh.portal ? data.mesh.portal.stencilObject : data.mesh
        root.traverse( (n) => {
          if( n.userData['aria-description'] && n.uuid != data.mesh.uuid ){
            transcript += `<b>#${n.name}</b> ${n.userData['aria-description']}. `
          }
        })
        if( transcript.length ) html += `<br><b>transcript:</b><br><div class="transcript">${transcript}</div>`

        if (hasMeta && !data.mesh.portal ) html += `<br><br><a class="btn" style="float:right" onclick="xrf.navigator.to('${data.mesh.userData.href}')">Visit embedded scene</a>`
        window.notify(html,{timeout: 7000 * (hasMeta ? 1.5 : 1) })
      })

    },100)
    return this
  },

  setupNetworkListeners(){

    document.addEventListener('network.connect',    (e) => {
      console.log("network.connect")
      window.notify("🪐 connecting to awesomeness..")
      $chat.send({message:`🪐 connecting to awesomeness..`,class:['info'], timeout:5000})
    })

    document.addEventListener('network.connected',    (e) => {
      window.notify("🪐 connected to awesomeness..")
      $chat.visibleChatbar = true
      $chat.send({message:`🎉 ${e.detail.plugin.profile.name||''} connected!`,class:['info'], timeout:5000})
    })

    document.addEventListener('network.disconnect', () => {
      window.notify("🪐 disconnecting..")
    })

    document.addEventListener('network.info',    (e) => {
      window.notify(e.detail.message)
      $chat.send({...e.detail, class:['info'], timeout:5000})
    })

    document.addEventListener('network.error',    (e) => {
      window.notify(e.detail.message)
      $chat.send({...e.detail, class:['info'], timeout:5000})
    })

    return this
  },

  hidetopbarWhenMenuCollapse(){
    // hide topbar when menu collapse button is pressed
    document.addEventListener('$menu:collapse', (e) => this.el.querySelector("#topbar").style.display = e.detail === true ? 'block' : 'none')
    return this
  },

  hideUIWhenNavigating(){
    // hide ui when user is navigating the scene using mouse/touch
    let showUI = (show) => (e) => {
      let isChatMsg        = e.target.closest('.msg')
      let isChatLine       = e.target.id == 'chatline'
      let isChatEmptySpace = e.target.id == 'messages'
      let isUI             = e.target.closest('.ui')
      //console.dir({class: e.target.className, id: e.target.id, isChatMsg,isChatLine,isChatEmptySpace,isUI, tagName: e.target.tagName})
      if( isUI || e.target.tagName.match(/^(BUTTON|TEXTAREA|INPUT|A)/) || e.target.className.match(/(btn)/) ) return
      if( show ){
        $chat.visible = true
      }else{
        $chat.visible = false
        $menu.toggle(false)
      }
      return true
    }
    document.addEventListener('mousedown',  showUI(false) )
    document.addEventListener('mouseup',    showUI(true)  )
    document.addEventListener('touchstart', showUI(false) )
    document.addEventListener('touchend',   showUI(true)  )
  },

  loadFile(contentLoaders, multiple){
    return () => {
      window.notify("if you're on Meta browser, file-uploads might be disabled")
      let input = document.createElement('input');
      input.type = 'file';
      input.multiple = multiple;
      input.accept = Object.keys(contentLoaders).join(",");
      input.onchange = () => {
          let files = Array.from(input.files);
          let file = files.slice ? files[0] : files
          for( var i in contentLoaders ){
            let r = new RegExp('\\'+i+'$')
            if( file.name.match(r) ) return contentLoaders[i](file)
          }
          alert(file.name+" is not supported")
      };
      input.click();
    }
  },

  notify(_str,opts){
      if( window.outerWidth < 800 ) return
      if( window.accessibility && window.accessibility.enabled ) return $chat.send({message:_str,class:['info']})
      opts = opts || {status:'info'}
      opts = Object.assign({ status, timeout:4000 },opts)
      opts.message = _str
      if( typeof str == 'string' ){
        str = _str.replace(/(^\w+):/,"<div class='badge'>\$1</div>")
        if( !opts.status ){
          if( str.match(/error/g)   ) opts.status = "danger"
          if( str.match(/warning/g) ) opts.status = "warning"
        }
        opts.message = str
      }
      window.SnackBar( opts )
      opts.message = typeof _str == 'string' ? _str : _str.innerText
      window.frontend.emit("notify",opts)
  },

  download(){
    function fetchAndDownload(dataurl, filename) {
      var a = document.createElement("a");
      a.href = dataurl;
      a.setAttribute("download", filename);
      a.click();
      return false;
    }
    let file = document.location.search.replace(/\?/,'')
    fetchAndDownload( file, file )
  },

  updateHashPosition(randomize){
    // *TODO* this should be part of the XRF Threejs framework
    if( typeof THREE == 'undefined' ) THREE = xrf.THREE
    let radToDeg  = THREE.MathUtils.radToDeg
    let toDeg     = (x) => x / (Math.PI / 180)
    let camera    = document.querySelector('[camera]').object3D.parent // *TODO* fix for threejs
    camera.position.x += Math.random()/10
    camera.position.z += Math.random()/10

    // *TODO* add camera direction
    let direction = new xrf.THREE.Vector3()
    camera.getWorldDirection(direction)
    const pitch   = Math.asin(direction.y);
    const yaw     = Math.atan2(direction.x, direction.z);
    const pitchInDegrees = pitch * 180 / Math.PI;
    const yawInDegrees = yaw * 180 / Math.PI;

    let lastPos = `pos=${camera.position.x.toFixed(2)},${camera.position.y.toFixed(2)},${camera.position.z.toFixed(2)}`
    let newHash = document.location.hash.replace(/[&]?(pos|rot)=[0-9\.-]+,[0-9\.-]+,[0-9\.-]+/,'')
    newHash += `&${lastPos}`
    document.location.hash = newHash.replace(/&&/,'&')
                                    .replace(/#&/,'')
    this.copyToClipboard( window.location.href );
  },

  copyToClipboard(text){
    // copy url to clipboard
    var dummy = document.createElement('input')
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
  },

  share(opts){
    opts = opts || {notify:true,qr:true,share:true,linkonly:false}
    if( network.meetingLink && !document.location.hash.match(/meet=/) ){
      document.location.hash += `&meet=${network.meetingLink}`
    }
    if( !document.location.hash.match(/pos=/) ){
      document.location.hash += `&pos=${ network.posName || network.pos }`
    }
    let url = window.location.href
    if( opts.linkonly ) return url
    this.copyToClipboard( url )
    // End of *TODO*
    if( opts.notify ){
      window.notify(`<h2>${ network.connected ? 'Meeting link ' : 'Link'} copied to clipboard!</h2>
        Now share it with your friends ❤️<br>
        <canvas id="qrcode" width="121" height="121"></canvas><br>
        <button onclick="frontend.download()"><i class="gg-software-download"></i>&nbsp;&nbsp;&nbsp;download scene file</button> <br>
        <button onclick="alert('this might take a while'); $('a-scene').components.screenshot.capture('equirectangular')"><i class="gg-image"></i>&nbsp;&nbsp;download 360 screenshot</button> <br>
        <a class="btn" target="_blank" href="https://github.com/coderofsalvation/xrfragment-helloworld"><i class="gg-serverless"></i>&nbsp;&nbsp;&nbsp;clone & selfhost this experience</a><br>
        To embed this experience in your blog,<br>
        copy/paste the following into your HTML:<br><input type="text" value="&lt;iframe src='${document.location.href}'&gt;&lt;/iframe&gt;" id="share"/>
        <br>
        <br>
      `,{timeout:false})
    }
    // draw QR code
    if( opts.qr ){
      setTimeout( () => {
        let QR  = window.QR
        QR.canvas = document.getElementById('qrcode')
        QR.draw( url, QR.canvas )
      },1)
    }
    // mobile share
    if( opts.share && typeof navigator.share != 'undefined'){
      navigator.share({
        url,
        title: 'your meeting link'
      })
    }
    $menu.collapse = true
  }

},
{
  // auto-trigger events on changes
  get(me,k,receiver){ return me[k] },
  set(me,k,v){
    let from   = me[k]
    me[k] = v
    switch( k ){
      case "logo":       $logo.style.backgroundImage = `url(${v})`;          break;
      default:           me.emit(`me.${k}.change`, {from,to:v}); break;
    }
  }
})

frontend = frontend({xrf,document}).init()
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
// a portable snackbar

window.SnackBar = function(userOptions) {
    var snackbar = this || (window.snackbar = {});
    var _Interval;
    var _Message;
    var _Element;
    var _Container;
    
    var _OptionDefaults = {
        message: "Operation performed successfully.",
        dismissible: true,
        timeout: 7000,
        status: ""
    }
    var _Options = _OptionDefaults;

    function _Create() {
        _Container = document.querySelector(".js-snackbar-container") 
        if( _Container ){
          _Container.remove()
        }
        _Container = null

        if (!_Container) {
            // need to create a new container for notifications
            _Container = document.createElement("div");
            _Container.classList.add("js-snackbar-container");

            document.body.appendChild(_Container);
        }
        _Container.opts = _Options
        _Container.innerHTML = ''
        _Element = document.createElement("div");
        _Element.classList.add("js-snackbar__wrapper","xrf");

        let innerSnack = document.createElement("div");
        innerSnack.classList.add("js-snackbar", "js-snackbar--show");
    
        if (_Options.status) {
            _Options.status = _Options.status.toLowerCase().trim();

            let status = document.createElement("span");
            status.classList.add("js-snackbar__status");


            if (_Options.status === "success" || _Options.status === "green") {
                status.classList.add("js-snackbar--success");
            }
            else if (_Options.status === "warning" || _Options.status === "alert" || _Options.status === "orange") {
                status.classList.add("js-snackbar--warning");
            }
            else if (_Options.status === "danger" || _Options.status === "error" || _Options.status === "red") {
                status.classList.add("js-snackbar--danger");
            }
            else {
                status.classList.add("js-snackbar--info");
            }

            innerSnack.appendChild(status);
        }
        
        _Message = document.createElement("span");
        _Message.classList.add("js-snackbar__message");
        if( typeof _Options.message == 'string' ){
          _Message.innerHTML = _Options.message;
        }else _Message.appendChild(_Options.message)

        innerSnack.appendChild(_Message);

        if (_Options.dismissible) {
            let closeBtn = document.createElement("span");
            closeBtn.classList.add("js-snackbar__close");
            closeBtn.innerText = "\u00D7";

            closeBtn.onclick = snackbar.Close;

            innerSnack.appendChild(closeBtn);
        }

        _Element.style.height = "0px";
        _Element.style.opacity = "0";
        _Element.style.marginTop = "0px";
        _Element.style.marginBottom = "0px";

        _Element.appendChild(innerSnack);
        _Container.appendChild(_Element);

        if (_Options.timeout !== false) {
            _Interval = setTimeout(snackbar.Close, _Options.timeout);
        }
    }

    snackbar.Open = function() {
        let contentHeight = _Element.firstElementChild.scrollHeight; // get the height of the content

        _Element.style.height = contentHeight + "px";
        _Element.style.opacity = 1;
        _Element.style.marginTop = "5px";
        _Element.style.marginBottom = "5px";

        _Element.addEventListener("transitioned", function() {
            _Element.removeEventListener("transitioned", arguments.callee);
            _Element.style.height = null;
        })
    }

    snackbar.Close = function () {
        if (_Interval)
            clearInterval(_Interval);

        let snackbarHeight = _Element.scrollHeight; // get the auto height as a px value
        let snackbarTransitions = _Element.style.transition;
        _Element.style.transition = "";

        requestAnimationFrame(function() {
            _Element.style.height = snackbarHeight + "px"; // set the auto height to the px height
            _Element.style.opacity = 1;
            _Element.style.marginTop = "0px";
            _Element.style.marginBottom = "0px";
            _Element.style.transition = snackbarTransitions

            requestAnimationFrame(function() {
                _Element.style.height = "0px";
                _Element.style.opacity = 0;
            })
        });

        setTimeout(function() {
            try { 
              _Container.removeChild(_Element); 
            } catch (e) { }
        }, 1000);
    };

    _Options = { ..._OptionDefaults, ...userOptions }
    _Create();
    if( userOptions ) snackbar.Open();
}

document.head.innerHTML += `
  <style type="text/css">

    .js-snackbar-container .btn,
    .js-snackbar-container input[type=submit],
    .js-snackbar-container button{
      margin-bottom:15px;
    }
    .js-snackbar-container {
        position: absolute;
        top: 10px;
        left: 0px;
        display: flex;
        align-items: center;
      width:100%;
        max-width: 100%;
        padding: 10px;
        z-index:1001;
      justify-content: center;
        overflow: hidden;
    }

    .js-snackbar-container * {
        box-sizing: border-box;
    }

    .js-snackbar__wrapper {
      --color-c: #555;
      --color-a: #FFF;
    }


    .js-snackbar__wrapper {
        transition:1s;
        overflow: hidden;
        height: auto;
        margin: 5px 0;
        transition: all ease .5s;
        border-radius: 15px;
        box-shadow: 0 0 4px 0 var(--xrf-box-shadow);
        right: 20px;
        position: fixed;
        top: 18px;
    }

    .js-snackbar {
        display: inline-flex;
        box-sizing: border-box;
        border-radius: 3px;
        color: var(--color-c);
        background-color: var(--color-a);
        vertical-align: bottom;
    }

    .js-snackbar__close,
    .js-snackbar__status,
    .js-snackbar__message {
        position: relative;
    }

    .js-snackbar__message {
      margin: 12px;
    }

    .js-snackbar__status {
        display: none;
        width: 15px;
        margin-right: 5px;
        border-radius: 3px 0 0 3px;
        background-color: transparent;
    }

     .js-snackbar__status.js-snackbar--success,
     .js-snackbar__status.js-snackbar--warning,
     .js-snackbar__status.js-snackbar--danger,
     .js-snackbar__status.js-snackbar--info {
        display: block;
    }

    .js-snackbar__status.js-snackbar--success  {
        background-color: #4caf50;
    }

    .js-snackbar__status.js-snackbar--warning  {
        background-color: #ff9800;
    }

     .js-snackbar__status.js-snackbar--danger {
        background-color: #ff6060;
    }

    .js-snackbar__status.js-snackbar--info {
        background-color: #CCC;
    }

    .js-snackbar__close {
        cursor: pointer;
        display: flex;
        align-items: top;
        padding: 8px 13px 0px 0px;
        user-select: none;
    }

    .js-snackbar__close:hover {
        background-color: #4443;
    }
  </style>
`
}).apply({})
