connectionsComponent = {

  html: `
   <div id="connections">
      <h2>Network channels:</h2>
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
          <td>Scene</td>
          <td>
            <select id="scene"></select>
          </td>
        </tr>
      </table>
      <div id="settings"></div>
      <br>
      <button id="connect" onclick="$connections.connect()">📡 Connect!</button>
      <br>
    </div>
  `,

  init: (el) => new Proxy({

    webcam:       [{plugin:{name:"No thanks"},config(){}}],
    chatnetwork:  [{plugin:{name:"No thanks"},config(){}}],
    scene:        [{plugin:{name:"No thanks"},config(){}}],

    $webcam:       $webcam      = el.querySelector("#webcam"),
    $chatnetwork:  $chatnetwork = el.querySelector("#chatnetwork"),
    $scene:        $scene       = el.querySelector("#scene"),
    $settings:     $settings    = el.querySelector("#settings"),

    
    install(opts){
      this.opts  = opts
      document.dispatchEvent( new CustomEvent("$connections:ready", {detail: opts}) )

      $webcam.addEventListener('change',      () => this.renderSettings() ) 
      $chatnetwork.addEventListener('change', () => this.renderSettings() ) 
      $scene.addEventListener('change',       () => this.renderSettings() ) 
    },

    show(){
      if( !network.connected ){
          $chat.send({message:"", el})
          this.renderSettings()
      }else $chat.send({message:"you are already connected, refresh page to create new connection",class:['info']})
    },

    connect(){
      navigator.share({
        url: 'https://foo.com',
        title: 'your meeting link'
      })
    },

    renderSettings(){
      let opts = {webcam: $webcam.value, chatnetwork: $chatnetwork.value, scene: $scene.value }
      let theWebcam      = this.webcam.find(      (p) => p.plugin.name == $webcam.value )
      let theChatnetwork = this.chatnetwork.find( (p) => p.plugin.name == $chatnetwork.value )
      let theScene       = this.scene.find(       (p) => p.plugin.name == $scene.value )
      $settings.innerHTML = ''
      $settings.appendChild(theWebcam.config(opts))
      if( theChatnetwork.plugin.name != theWebcam.plugin.name ) $settings.appendChild( theChatnetwork.config(opts) )
      if( theScene.plugin.name != theWebcam.plugin.name && theScene.plugin.name != theChatnetwork.plugin.name ) 
        $settings.appendChild( scene.config(opts) )
    }

  },{

    get(data,k,v){ return data[k] },
    set(data,k,v){ 
      data[k] = v 
      switch( k ){
        case "webcam":      $webcam.innerHTML       = `<option>${data[k].map((p)=>p.plugin.name).join('</option><option>')}</option>`; break;
        case "chatnetwork": $chatnetwork.innerHTML  = `<option>${data[k].map((p)=>p.plugin.name).join('</option><option>')}</option>`; break;
        case "scene":       $scene.innerHTML        = `<option>${data[k].map((p)=>p.plugin.name).join('</option><option>')}</option>`; break;
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
