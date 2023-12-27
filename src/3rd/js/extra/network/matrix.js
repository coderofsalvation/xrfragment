window.matrix = (opts) => new Proxy({

  el: null, // HTML element

  plugin:{
    type: 'network',
    name: '[matrix] channel',
    description: 'a standardized decentralized privacy-friendly protocol',
    url: 'https://matrix.org',
    protocol: 'matrix://',
    video: false,
    audio: false,
    chat: true,
    scene: true
  },

  html: {
    generic: (opts) => `<div>
        <a href="${opts.url}" target="_blank" class="badge ruler">matrix</a>
        <table>
          <tr>
            <td>channel</td>
            <td>
              <input type="text" id="channel" placeholder="#xrfragment:matrix.org"/>
            </td>
          </tr>
          <tr>
            <td>server</td> 
            <td>
              <input type="text" id="server" placeholder="https://matrix.org"/>
            </td>
          </tr>
          <tr>
            <td>user</td> 
            <td>
              <input type="text" id="username" placeholder="@you:matrix.org"/>
            </td>
          </tr>
          <tr>
            <td>authenticate</td> 
            <td>
              <select>
                <option>via password</option>
                <option>via access token</option>
              </select> 
            </td>
          </tr>
          <tr>
            <td></td> 
            <td>
              <input type="text" id="secret" placeholder="password or token"/>
            </td>
          </tr>
        </table>
        <small style="display:inline-block;float:right">Support for Oauth / OpenID is <a href="https://matrix.org/blog/#openid-connect" target="_blank">in progress</a></small>
        <br><br>
      </div>
    `
  },

  init(){
    let network = window.network
    network.plugin['matrix'] = this
    $connections.chatnetwork = $connections.chatnetwork.concat([this])
    $connections.scene       = $connections.scene.concat([this])
    this.reactToConnectionHrefs()
  },

  connect(opts){
    console.log("connecting "+this.plugin.name)
    console.dir(opts)
  },

  config(opts){
    opts = {...opts, ...this.plugin }
    this.el   = document.createElement('div')
    let html = this.html.generic(opts)
    for( let i in opts ){
      if( this.html[i] ) html += this.html[i](opts)
    }
    this.el.innerHTML = html
    window.notify(`${opts.name} is ${opts.description}, it is the hottest internet technology available at this moment.<br>Read more about it <a href="${opts.url}" target="_blank">here</a>.<br>You can basically make up a new channelname or use an existing one`)
    return this.el
  },

  reactToConnectionHrefs(){
    xrf.addEventListener('href', (opts) => {
      let {mesh} = opts
      if( !opts.click ) return
      if( mesh.userData.href.match(this.protocol) ){
        let parts = mesh.userData.href.replace(this.plugin.protocol,'')
        if( parts[0] == 'r' ){ // room
          $connections.$chatnetwork.value = this.plugin.name
          $connections.$scene.value       = this.plugin.name
          $connections.show()
          let server  = parts.split("/")[1].replace(/:.*/,'') 
          let channel = parts.split("/")[1].replace(/.*:/,'')
          this.el.querySelector('#channel').value = `#${channel}:${server}`
          this.el.querySelector('#server').value  = server 
          console.log("configured matrix")
        }
      }else window.notify("malformed connection URI: "+mesh.userData.href)
    })
  }
},
{ 
  // auto-trigger events on changes 
  get(data,k,receiver){ return data[k] },
  set(data,k,v){
    let from   = data[k]
    data[k] = v
    //switch( k ){
    //  default: matrix.opts.scene.dispatchEvent({type:`matrix.${k}.change`, from, to:v})
    //}
  }
})
      
document.addEventListener('$connections:ready', (e) => {
  matrix(e.detail).init()
})

