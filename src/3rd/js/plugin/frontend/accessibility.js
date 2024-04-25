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

