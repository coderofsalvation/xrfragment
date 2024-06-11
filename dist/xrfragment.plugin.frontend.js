(function(){
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
        if( _Options.onclose ) _Options.onclose()

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
        max-width:500px;
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
window.accessibility = (opts) => new Proxy({
  opts,

  enabled: false,

  // features
  speak_teleports: true,
  speak_keyboard: false,

  // audio settings
  speak_rate: 1,
  speak_pitch: 1,
  speak_volume: 1,
  speak_voice: -1,
  speak_voices: 0,

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
    this.speak_voices = speech.getVoices().length
    if( this.speak_voice != -1 && this.speak_voice < this.speak_voices ){
      utterance.voice  = speech.getVoices()[ this.speak_voice ];
    }else{
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
      document.addEventListener('$chat.send', (opts) => {
        if( opts.detail.message ) this.speak( opts.detail.message)
      })
    })

    document.addEventListener('network.send', (e) => {
      let opts = e.detail
      opts.message = opts.message || ''
      this.speak(opts.message)
    })

    opts.xrf.addEventListener('pos', (opts) => {
      if( this.enabled && this.speak_teleports ){
        network.send({message: this.posToMessage(opts), class:["info","guide"]})
      }
      if( opts.frag.pos.string.match(/,/) ){
        network.pos = opts.frag.pos.string
      }else{
        network.posName = opts.frag.pos.string
      }
    })

    setTimeout( () => this.initCommands(), 200 )
    // auto-enable if previously enabled
    if( window.localStorage.getItem("accessibility") === 'true' ){
      setTimeout( () => {
        this.enabled = true
        this.setFontSize()
      }, 100 )
    }
  },

  initCommands(){

    document.addEventListener('chat.command.help', (e) => {
      e.detail.message += `<br><b class="badge">/fontsize &lt;number&gt;</b> set fontsize (default=14) `
    })

    document.addEventListener('chat.command', (e) => {
      if( e.detail.message.match(/^fontsize/) ){
        try{
          let fontsize = parseInt( e.detail.message.replace(/^fontsize /,'').trim() )
          if( fontsize == NaN ) throw 'not a number'
          this.setFontSize(fontsize)
          $chat.send({message:'fontsize set to '+fontsize})
        }catch(e){
          console.error(e)
          $chat.send({message:'example usage: /fontsize 20'})
        }
      }
    })

  },

  setFontSize(size){
    if( size ){
      window.localStorage.setItem("fontsize",size)
    }else size = window.localStorage.getItem("fontsize")
    if( !size ) return 
    document.head.innerHTML += `
      <style type="text/css">
        .accessibility #messages * {
          font-size: ${size}px !important;
          line-height: ${size*2}px !important;
        }
      </style>
    `
    $messages = document.querySelector('#messages')
    setTimeout( () => $messages.scrollTop = $messages.scrollHeight, 1000 )
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
                        let message = "accessibility mode has been "+(v?"activated":"disabled")+".<br>Type /help for help."
                        if( v ) message = "<img src='https://i.imgur.com/wedtUSs.png' style='width:100%;border-radius:6px'/><br>" + message
                        $('#accessibility.btn').style.filter= v ? 'brightness(1.0)' : 'brightness(0.5)'
                        if( v ) $chat.visible = true
                        $chat.send({message,class:['info']})
                        data.enabled = true
                        data.speak(message)
                        data.enabled = v
                        window.localStorage.setItem("accessibility", v)
                        $chat.$messages.classList[ v ? 'add' : 'remove' ]('guide')
                        document.body.classList.toggle(['accessibility'])
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

document.querySelector('head').innerHTML += `
  <style type="text/css"> 
    .accessibility #messages * {
      font-size:24px !important;
      line-height:40px;
    }
    .accessibility #messages .msg.self {
      background:var(--xrf-gray);
      color:#FFF;
    }
    .accessibility #messages .msg.info,
    .accessibility #messages .msg.self {
      line-height:unset;
      padding-top:15px;
      padding-bottom:15px;
    }
    .accessibility #chatbar{
      display: block !important;
    }
    .accessibility #chatsend{
      display: block !important;
    }
    .accessibility #chatline {
      text-indent:25px;
    }
  </style>
`

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
        let instructions = AFRAME.utils.device.isMobile() 
                           ? "hold 2-3 fingers to move forward/backward" 
                           :  "use WASD-keys and mouse-drag to move around"
        window.notify(instructions,{timeout:false})
        xrf.addEventListener('pos', (opts) => {
          let pos = opts.frag.pos.string 
          window.notify('<b class="badge">teleporting</b> to <b>'+pos+"</b><br>use back/forward (browserbutton) to undo")
        }) // close dialogs when url changes
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
        let root = data.mesh.portal ? data.mesh.portal.stencilObject : data.mesh
        let transcript = xrf.sceneToTranscript(root,data.mesh)
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
      let isUI             = e.target.closest('.ui')      || 
                             e.target.closest('.btn')     ||
                             e.target.closest('button')   ||
                             e.target.closest('textarea') ||
                             e.target.closest('input')    ||
                             e.target.closest('a')
      //console.dir({class: e.target.className, id: e.target.id, isChatMsg,isChatLine,isChatEmptySpace,isUI, tagName: e.target.tagName})
      if( isUI ) return 
      if( show ){
        if( typeof $chat != 'undefined' ) $chat.visible = true
      }else{
        if( typeof $chat != 'undefined' ) $chat.visible = false
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
            if( file.name.match(r) ){
              xrf.navigator.URI.file = '' // bypass cached file (easy refresh same file for testing)
              return contentLoaders[i](file)
            }
          }
          alert(file.name+" is not supported")
      };
      input.click();
    }
  },

  notify(_str,opts){
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

    function download(dataurl, filename) {
      var a = document.createElement("a");
      a.href = URL.createObjectURL( new Blob([dataurl]) );
      a.setAttribute("download", filename);
      a.click();
      return false;
    }

    function exportScene(model,ext,file){
      document.dispatchEvent( new CustomEvent('frontend.export',{detail:{ scene: model.scene,ext}}) )
      xrf.emit('export', {scene: model.scene, ext})
      .then( () => {
        // setup exporters
        let defaultExporter = THREE.GLTFExporter
        xrf.loaders['gltf'].exporter    = defaultExporter
        xrf.loaders['glb'].exporter     = defaultExporter
        const exporter = new THREE.GLTFExporter() 
        exporter.parse(
          model.scene,
          function ( glb   ) { download(glb, `${file}`) },    // ready
          function ( error ) { console.error(error) },   // error
          {
            binary:true, 
            onlyVisible: false, 
            animations: model.animations,
            includeCustomExtensions: true,
            trs:true
          } 
        );
      })      
    }

    // load original scene and overwrite with updates
    let url = document.location.search.replace(/\?/,'')
    let {urlObj,dir,file,hash,ext} = xrf.navigator.origin = xrf.URI.parse(url)
    const Loader = xrf.loaders[ext]
    loader = new Loader().setPath( dir )
    notify('exporting scene<br><br>please wait..')
    loader.load(url, (model) => {
      exportScene(model,ext,file)
    })
  },

  updateHashPosition(randomize){
    const pos = xrf.frag.pos.get()
    xrf.navigator.reactifyHash.enabled = false // prevent teleport
    xrf.navigator.URI.hash.pos = `${pos.x},${pos.y},${pos.z}`
    xrf.navigator.reactifyHash.enabled = true
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
    if( network.meetingLink && !xrf.navigator.URI.hash.meet ){
      xrf.navigator.URI.hash.meet = network.meetingLink
    }
    if( !xrf.navigator.URI.hash.pos && (network.posName || network.pos) ){
      xrf.navigator.URI.hash.pos = network.posName || network.pos
    }else frontend.updateHashPosition()

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
// this allows surfing to a href by typing its node-name 

// help screen
document.addEventListener('chat.command.help', (e) => {
  e.detail.message += `
    <br><b class="badge">&lt;destinationname&gt;</b> surf to a destination
  ` 
})
        
document.addEventListener('chat.input', (e) => {

  let name = e.detail.message.trim()
  xrf.scene.traverse( (n) => {
    if( n.userData && n.userData.href && n.userData.href.match(/pos=/) && n.name == name ){
      $chat.send({message:'<b class="badge">activating</b> '+n.name, class:['self','info']})
      xrf.navigator.to( n.userData.href )
    }
  })

})
// this allows a more-or-less MUD type interface
//
//


// help screen
document.addEventListener('chat.command.help', (e) => {
  e.detail.message += `
    <br><b class="badge">?</b> help screen
    <br><b class="badge">look</b> view scene and destinations 
    <br><b class="badge">go [left|right|forward|destination]</b> surf [to destination]
    <br><b class="badge">do [action]</b> list [or perform] action(s)
    <br><b class="badge">rotate &lt;left|right|up|down&gt;</b> rotate camera
    <br><b class="badge">back</b> go to previous portal/link 
    <br><b class="badge">forward</b> go to previous portal/link 
    <br><b class="badge">#....</b> execute XR Fragments 
    <hr/>
  ` 
})

const listExits = (scene) => {
  let message = ''
  let destinations = {}
  scene.traverse( (n) => {
    if( n.userData && n.userData.href && n.userData.href.match(/pos=/) ){
      destinations[n.name] = n.userData['aria-label'] || n.userData.href
    } 
  })
  for( let destination in destinations ){
    message += `<br><b class="badge">${destination}</b> ${destinations[destination]}`
  }
  if( !message ) message += '<br>type <b class="badge">back</b> to go back'
  return message
}

const listActions = (scene) => {
  let message = ''
  let destinations = {}
  scene.traverse( (n) => {
    if( n.userData && n.userData.href && !n.userData.href.match(/pos=/) ){
      destinations[n.name] = n.userData['aria-description'] || n.userData['aria-label'] || n.userData.href
    } 
  })
  for( let destination in destinations ){
    message += `<br><b class="badge">${destination}</b> ${destinations[destination]}`
  }
  if( !message ) message += '<br>no actions found'
  return message
}

document.addEventListener('chat.input', (e) => {

  if( e.detail.message.trim() == '?' ){
    document.dispatchEvent( new CustomEvent( 'chat.command', {detail:{message:"help"}} ) )
    e.detail.halt = true // don't send to other peers 
  }

  if( e.detail.message.trim() == 'look' ){
    let scene   = xrf.frag.pos.last ? xrf.scene.getObjectByName(xrf.frag.pos.last)  : xrf.scene
    let message = `<div class="transcript">${xrf.sceneToTranscript(scene)}</div><br>possible destinations in this area:${listExits(scene)}`
    e.detail.halt = true // dont print command to screen
    $chat.send({message})
  }

  if( e.detail.message.match(/^go($| )/) ){
    if( e.detail.message.trim() == 'go' ){
      $chat.send({message: `all possible destinations:${listExits(xrf.scene)}`})
    }else{
      let destination = e.detail.message.replace(/^go /,'').trim()
      if( destination.match(/(left|right|forward|backward)/) ){
        let key = ''
        switch( destination){
          case "left":     key = 'ArrowLeft';    break;
          case "right":    key = 'ArrowRight';   break;
          case "forward":  key = 'ArrowUp';      break;
          case "backward": key = 'ArrowDown';    break;
        }
        if( key ){
          let lookcontrols = document.querySelector('[look-controls]')
          if( lookcontrols ) lookcontrols.removeAttribute('look-controls') // workaround to unlock camera

          var wasd = document.querySelector('[wasd-controls]').components['wasd-controls']
          wasd.keys[ key ] = true
          wasd.velocity = new THREE.Vector3()
          setTimeout( () => delete wasd.keys[ key ], 100 )
          wasd.el.object3D.matrixAutoUpdate = true;
          wasd.el.object3D.updateMatrix()
          xrf.camera.getCam().updateMatrix() 
        }
        
      }else{
        let node
        xrf.scene.traverse( (n) => {
          if( n.userData && n.userData.href && n.name == destination ) node = n
        })
        if( node ) xrf.navigator.to( node.userData.href )
        else $chat.send({message:"type 'look' for possible destinations"})
      }
    }
    e.detail.halt = true // dont write input to chat
  }

  if( e.detail.message.match(/^do($| )/) ){
    if( e.detail.message.trim() == 'do' ){
      $chat.send({message: `all possible actions:${listActions(xrf.scene)}`})
    }else{
      let action = e.detail.message.replace(/^do /,'').trim()
      xrf.scene.traverse( (n) => {
        if( n.userData && n.userData.href && n.name == action ){
          $chat.send({message:'<b class="badge">activating</b> '+n.name, class:['self','info']})
          xrf.navigator.to( n.userData.href )
        }
      })
    }
    e.detail.halt = true // dont write input to chat
  }

  if( e.detail.message.match(/^rotate /) ){
    let dir = e.detail.message.replace(/^rotate /,'').trim()
    let y = 0;
    let x = 0;
    switch(dir){
      case "left":  y =  0.3; break;
      case "right": y = -0.3; break;
      case "up":    x =  0.3; break;
      case "down":  x = -0.3; break;
    }
    let lookcontrols = document.querySelector('[look-controls]')
    if( lookcontrols ) lookcontrols.removeAttribute('look-controls') // workaround to unlock camera
    xrf.camera.rotation.y += y
    xrf.camera.rotation.x += x
    xrf.camera.matrixAutoUpdate = true
    e.detail.halt = true // dont write input to chat
  }

  if( e.detail.message.trim() == 'back' ){
    window.history.back()
  }

  if( e.detail.message.trim() == 'forward' ){
    window.history.forward()
  }

})
// this allows surfing to a href by typing its node-name 

// help screen
document.addEventListener('chat.command.help', (e) => {
  e.detail.message += `
    <br><b class="badge">/speak_keyboard &lt;true|false&gt;</b> turn on/off keyboard input TTS
    <br><b class="badge">/speak_teleports &lt;true|false&gt;</b> turn on/off TTS for teleports
    <br><b class="badge">/speak_rate &lt;1&gt;</b> adjust TTS speed
    <br><b class="badge">/speak_pitch &lt;1&gt;</b> adjust TTS pitch
    <br><b class="badge">/speak_volume &lt;1&gt;</b> adjust TTS volume
    <br><b class="badge">/speak_voice &lt;0&gt;</b> select voice (max: ${window.accessibility.speak_voices})
  ` 
})
        
document.addEventListener('chat.command', (e) => {
  if( !e.detail.message.trim().match(/ /) ) return 
  let action = e.detail.message.trim().split(" ")[0]
  let value  = e.detail.message.trim().split(" ")[1]

  if( window.accessibility[action] == undefined ) return

  window.accessibility[action] = value
  window.localStorage.setItem(action, value )
  $chat.send({message: `${action} set to ${value}`, class:['info']})

})
}).apply({})
