connectionsComponent = {

  html: `
   <div id="connections">
      <i class="gg-close-o" id="close" onclick="$connections.toggle()"></i>
      <br>
      <div class="tab-frame">
        <input type="radio" name="tab" id="login" checked>
        <label for="login">login</label>

        <input type="radio" name="tab" id="networks">
        <label for="networks">networks</label>
          
        <input type="radio" name="tab" id="io">
        <label for="io">devices</label>
       
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
          <div id="networking">
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
      </div>
    </div>
  `,

  init: (el) => new Proxy({

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
      let parent = el.closest('.envelope')
      parent.style.display = parent.style.display == 'none' ? parent.style.display = '' : 'none'
    },

    change(id,e){
      if( id.match(/^(webcam|chatnetwork|scene)$/) ){
        this.renderSettings() // trigger this when 'change' event fires on children dom elements
      }
    },

    show(opts){
      opts = opts || {}
      if( opts.hide ){
        el.parentElement.parentElement.style.display = 'none'
      }else{
        $chat.visible = true
        // hide networking settings if entering thru meetinglink
        $networking.style.display = document.location.href.match(/meet=/) ? 'none' : 'block'
        if( !network.connected ){
            if( el.parentElement ) el.parentElement.parentElement.remove()
            document.querySelector('body > .xrf').appendChild(el)
            $chat.send({message:"", el, class:['ui']})
            if( !network.meetinglink ){ // set default
              $webcam.value      = 'Peer2Peer'
              $chatnetwork.value = 'Peer2Peer'
              $scene.value       = 'Peer2Peer'
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
      if( this.selectedWebcam == 'No thanks' ){
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
        this.show({hide:true})
        $connect.innerText = 'connecting..' 
      })

      document.addEventListener('network.disconnect', () => {
        $connect.innerText = 'disconnecting..'
        setTimeout( () => $connect.innerText = 'connect', 1000)
      })

    }

  },{

    get(data,k,v){ return data[k] },
    set(data,k,v){ 
      data[k] = v 
      switch( k ){
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
