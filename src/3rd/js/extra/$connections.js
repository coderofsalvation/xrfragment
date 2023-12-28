connectionsComponent = {

  html: `
   <div id="connections">
      <h2>Connection layers:</h2>
      <table>
        <tr>
          <td>Webcam/Audio</td>
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
          <td>Scene</td>
          <td>
            <select id="scene"></select>
          </td>
        </tr>
      </table>
      <div id="settings"></div>
      <br>
      <button id="connect" onclick="$connections.connect()">📡 Connect!</button>
      <br><br>
    </div>
  `,

  init: (el) => new Proxy({

    webcam:       [{plugin:{name:"No thanks"},config: () => document.createElement('div')}],
    chatnetwork:  [{plugin:{name:"No thanks"},config: () => document.createElement('div')}],
    scene:        [{plugin:{name:"No thanks"},config: () => document.createElement('div')}],

    selectedWebcam:     '',
    selectedChatnetwork:'',
    selectedScene:      '',

    $webcam:       $webcam      = el.querySelector("#webcam"),
    $chatnetwork:  $chatnetwork = el.querySelector("#chatnetwork"),
    $scene:        $scene       = el.querySelector("#scene"),
    $settings:     $settings    = el.querySelector("#settings"),
    $connect:      $connect    = el.querySelector("#connect"),
    
    install(opts){
      this.opts  = opts
      document.dispatchEvent( new CustomEvent("$connections:ready", {detail: opts}) )

      $webcam.addEventListener('change',      () => this.renderSettings() ) 
      $chatnetwork.addEventListener('change', () => this.renderSettings() ) 
      $scene.addEventListener('change',       () => this.renderSettings() ) 

    },

    show(){
      $chat.visible = true
      if( !network.connected ){
          if( el.parentElement ) el.parentElement.parentElement.remove()
          $chat.send({message:"", el})
          this.renderSettings()
          if( !network.meetinglink ){ // set default
            $webcam.value      = 'Peer2Peer'
            $chatnetwork.value = 'Peer2Peer'
            $scene.value       = 'Peer2Peer'
          }
      }else $chat.send({message:"you are already connected, refresh page to create new connection",class:['info']})
    },

    connect(){
      this.update()
      this.webcam.selected.connect({webcam:true})
      this.chatnetwork.selected.connect({chat:true})
      this.scene.selected.connect({scene:true})
      this.$connect.setAttribute('disabled','disabled')
      this.$connect.classList.add('disabled')
      window.notify("🪐 connecting to awesomeness..")
    },

    update(){
      this.selectedWebcam      = $webcam.value
      this.selectedChatnetwork = $chatnetwork.value
      this.selectedScene       = $scene.value
    },

    forSelectedPluginsDo(cb){
      // this function looks weird but it's handy to prevent the same plugins rendering duplicate configurations
      let plugins = {}
      let select = (name) => (o) => o.plugin.name == name ? plugins[ o.plugin.name ] = o : ''
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
      this.forSelectedPluginsDo( (plugin) => {
        console.log("configuring "+plugin.plugin.name)
        console.dir(plugin)
        $settings.appendChild( plugin.config(opts) )
      })
    },

  },{

    get(data,k,v){ return data[k] },
    set(data,k,v){ 
      data[k] = v 
      switch( k ){
        case "webcam":              $webcam.innerHTML       = `<option>${data[k].map((p)=>p.plugin.name).join('</option><option>')}</option>`; break;
        case "chatnetwork":         $chatnetwork.innerHTML  = `<option>${data[k].map((p)=>p.plugin.name).join('</option><option>')}</option>`; break;
        case "scene":               $scene.innerHTML        = `<option>${data[k].map((p)=>p.plugin.name).join('</option><option>')}</option>`; break;
        case "selectedScene":       $scene.value       = v; data.renderSettings(); break;
        case "selectedWebcam":      $webcam.value      = v; data.renderSettings(); break;
        case "selectedChatnetwork": $chatnetwork.value = v; data.renderSettings(); break;

      } 
    }

  })
}

// reactify component!
document.addEventListener('network:ready', (opts) => {
  opts = opts.detail
  document.head.innerHTML += connectionsComponent.css 
  $connections = document.createElement('div')
  $connections.innerHTML = connectionsComponent.html
  $connections = connectionsComponent.init($connections)
  $connections.install(opts)
})

// alpine component for displaying meetings

connectionsComponent.css = `
    <style type="text/css">
      button#connect{
        float: right;
        height: 43px;
        margin: 0px;
      }
   </style>`
