window.matrix = (opts) => new Proxy({

  el: null, // HTML element

  plugin:{
    type: 'network',
    name: '[Matrix]',
    description: 'a standardized decentralized privacy-friendly protocol',
    url: 'https://matrix.org',
    protocol: 'matrix://',
    video: false,
    audio: false,
    chat: true,
    scene: true
  },

  channel: '#xrfragment-test:matrix.org',
  server: 'https://matrix.org',
  username:'',
  auth: 'via password',
  authkey: '',
  client: null,
  roomid: '',

  html: {
    generic: (opts) => `<div>
        <div target="_blank" class="badge ruler">matrix <a onclick="frontend.plugin.matrix.info()"><i class="gg-info right"></i></a></div>
        <table id="matrix">
          <tr>
            <td>channel</td>
            <td>
              <input type="text" id="channel" placeholder="#xrfragment:matrix.org" value="${opts.plugin.channel}"/>
            </td>
          </tr>
          <tr>
            <td>server</td> 
            <td>  
              <input type="text" id="server" placeholder="https://matrix.org" value="${opts.plugin.server}"/>
            </td>
          </tr>
          <tr>
            <td>user</td> 
            <td>
              <input type="text" id="username" placeholder="@you:matrix.org"/>
            </td>
          </tr>
          <tr>
            <td>auth</td> 
            <td>
              <select id="auth">
                <option>via password</option>
                <option>via access token</option>
              </select> 
            </td>
          </tr>
          <tr>
            <td></td> 
            <td>
              <input type="password" id="secret" placeholder="enter password"/>
            </td>
          </tr>
        </table>
        <small style="display:inline-block;float:right">Support for Oauth / OpenID is <a href="https://matrix.org/blog/#openid-connect" target="_blank">in progress</a></small>
        <br>
      </div>
    `
  },

  init(){
    frontend.plugin['matrix'] = this
    $connections.chatnetwork = $connections.chatnetwork.concat([this])
    $connections.scene       = $connections.scene.concat([this])
    this.reactToConnectionHrefs()

    this.nickname         = localStorage.getItem("nickname") || `human${String(Math.random()).substr(5,4)}`
    document.addEventListener('network.connect', (e) => this.connect(e.detail) )
    document.addEventListener('network.init', () => {
      let meeting = network.getMeetingFromUrl(document.location.href)
      if( meeting.match(this.plugin.protocol) ){
        this.parseLink( meeting )
      }
    })
  },

  connect(opts){
    console.log("connecting "+this.plugin.name)
    this.channel  = document.querySelector("#matrix input#channel").value
    this.server   = document.querySelector("#matrix input#server").value
    this.username = document.querySelector("#matrix input#username").value
    this.auth     = document.querySelector("#matrix select#auth").value
    let secret = document.querySelector("#matrix input#secret").value
    document.querySelector("#matrix input#secret").value = ''

    let credentials =  { baseUrl: this.server }

    if( this.auth == 'via access token'){
      credentials.accessToken = secret 
      credentials.userId      = this.username
    }
    this.client = Matrix.sdk.createClient(credentials)
    if( this.auth == 'via password'){
      this.client.login("m.login.password",{"user": this.username, password: secret})
      .then( () => this.onMatrixConnect() )
      .catch( () => window.notify("authentication was not succesful 😞"))
    }else this.onMatrixConnect()
  },

  onMatrixConnect(){
      // token: this.matrixclient.getAccessToken()
    this.client.startClient()
    client.once('sync', function(state, prevState, res) {
      if( state == 'PREPARED' ) this.setupListeners()
      else console.log("state: "+state)
    });
  },

  setupListeners(){
    let rooms = this.client.getRooms();
    rooms.forEach(room => {
        console.log(room);
    });
    this.client.on("Room.timeline", function(event, room, toStartOfTimeline) {
      if( event.room_id && event.room_id == this.roomid ){
        console.dir(event);
      }
    });
  },

  config(opts){
    opts = {...opts, ...this.plugin }
    this.el   = document.createElement('div')
    let html = this.html.generic(opts)
    for( let i in opts ){
      if( this.html[i] ) html += this.html[i](opts)
    }
    this.el.innerHTML = html
    this.el.querySelector('#auth').addEventListener('change', (e) => {
      this.el.querySelector('#secret').setAttribute('placeholder', `enter ${e.target.value.replace(/.* /,'')}`)
    })
    return this.el
  },

  info(opts){
    window.notify(`${this.plugin.name} is ${this.plugin.description}, it is the hottest internet technology available at this moment.<br>Read more about it <a href="${this.plugin.url}" target="_blank">here</a>.<br>You can basically make up a new channelname or use an existing one`)
  },

  parseLink(url){
    if( !url.match(this.plugin.protocol) ) return
    let parts = url.replace(this.plugin.protocol,'').split("/")
    if( parts[0] == 'r' ){ // room
      let server  = parts.split("/")[1].replace(/:.*/,'') 
      let channel = parts.split("/")[1].replace(/.*:/,'')
      $connections.show()
      $connections.selectedChatnetwork        = this.plugin.name
      $connections.selectedScene              = this.plugin.name
      this.el.querySelector('#channel').value = `#${channel}:${server}`
      this.el.querySelector('#server').value  = server 
      console.log("configured matrix")
    }
    return false
  },

  reactToConnectionHrefs(){
    xrf.addEventListener('href', (opts) => {
      let {mesh} = opts
      if( !opts.click ) return
      this.parseLink(mesh.userData.href)
      let href = mesh.userData.href
      let isLocal    = href[0] == '#'
      let isTeleport = href.match(/(pos=|http:)/)
      if( isLocal && !isTeleport && this.href.send ) this.href.send({href})
    })
    let hashvars = xrf.URI.parse( document.location.hash )
    if( hashvars.meet ) this.parseLink(hashvars.meet.string)
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

