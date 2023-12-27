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
    if( this.enabled ) window.notify(`accessibility boosted, click <a href="#">here</a> to tweak settings`)
  },

  speak(str, override){
    if( !this.enabled || !str) return
    str = str.replace(/\/\//,' ')
             .replace(/:/,'')
             .replace(/\//,' slash ')
             .replace(/\./,' dot ')
             .replace(/#/,' hash ')
             .replace(/&/,' and ')
             .replace(/=/,' is ')
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
    if( override ) speech.cancel() 
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
      this.speak(k,true)
    })

    document.addEventListener('$menu:buttons:render', (e) => {
      let $    = e.detail
      let a = [...$.querySelectorAll('a')]
      // make sure anchor buttons are accessible by tabbing to them 
      a.map( (btn) => {
        if( !btn.href ) btn.setAttribute("href","javascript:void(0)") // important!
        btn.setAttribute("aria-label","button")
        btn.addEventListener('mouseover', (e) => {
          let str = btn.getAttribute("aria-title") + btn.getAttribute('aria-description')
          this.speak( str,true)
        })
      })
    })

    document.addEventListener('$chat:receive', (e) => {
      let opts = e.detail
      opts.message = opts.message || ''
      if( opts.class && ~opts.class.indexOf('info') ) opts.message = `info: ${opts.message}`
      this.speak(e.detail.message)
    })

    opts.addEventListener('pos', (opts) => {
      let obj
      let description
      let msg = "You've teleported to "
      let pos = opts.frag.pos
      if( pos.string.match(',') ) msg += `coordinates <a href="#pos=${pos.string}">${pos.string}</a>`
      else{
        msg += `location <a href="#pos=${pos.string}">${pos.string}</a>`
        obj = opts.scene.getObjectByName(pos.string)
        if( obj ){
          description = obj.userData['aria-label'] || ''
        }else msg += ", but your teleportation was refused because it cannot be found within this world"
      } 
      $chat.send({html: () => msg, class:["info","guide"]})
    })

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
                        let message = (v?"boosting":"unboosting") + " accessibility features"
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
  window.accessibility = accessibility(e.detail) 
  accessibility.init()
  document.dispatchEvent( new CustomEvent("accessibility:ready", e ) )
  $menu.buttons = $menu.buttons.concat([`<a class="btn" style="background:var(--xrf-dark-gray);filter: brightness(0.5);" aria-label="button" aria-description="enable all accessibility features" id="accessibility" onclick="accessibility.settings()">👩‍🚀 accessibility</a><br>`])

})
