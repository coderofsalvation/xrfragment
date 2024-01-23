window.matrix = (opts) => new Proxy({

  el: null, // HTML element

  profile:{
    type: 'network',
    name: '[Matrix]',
    description: 'a standardized decentralized privacy-friendly protocol',
    url: 'https://matrix.org',
    protocol: 'matrix://',
    video: false,
    audio: false,
    chat: true,
    scene: false
  },

  useWebcam: false,
  useChat:   false,
  useScene:  false,

  channel: '#xrfragment-test:matrix.org',
  server: 'https://matrix.org',
  username:'',
  auth: 'via password',
  authkey: '',
  client: null,
  roomid: '',

  // Matrix-CRDT
  ydoc:   null,
  yhref:  null,

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
        <br>
      </div>
    `
  },

  init(){
    frontend.plugin['matrix'] = this
    $connections.chatnetwork = $connections.chatnetwork.concat([this])
    this.reactToConnectionHrefs()

    this.nickname         = localStorage.getItem("nickname") || `human${String(Math.random()).substr(5,4)}`
    document.addEventListener('network.connect', (e) => this.connect(e.detail) )
    document.addEventListener('network.init', () => {
      let meeting = network.getMeetingFromUrl(document.location.href)
      if( meeting.match(this.profile.protocol) ){
        this.parseLink( meeting )
      }
    })
  },

  connect(opts){
    this.createLink() // ensure link 
    if( opts.selectedWebcam      == this.profile.name ) this.useWebcam = true
    if( opts.selectedChatnetwork == this.profile.name ) this.useChat   = true
    if( opts.selectedScene       == this.profile.name ) this.useScene  = true
    if( this.useWebcam || this.useScene || this.useChat ){
      this.link = `matrix://r/${this.channel.replace(/^#/,'')}`
      console.log("connecting "+this.profile.name)
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
      // Extra configuration needed for certain matrix-js-sdk
      // calls to work without calling sync start functions
      this.client.canSupportVoip = false;
      this.client.clientOpts = {
        lazyLoadMembers: true,
      };

      // auth
      if( this.auth == 'via password'){
        this.client.login("m.login.password",{"user": this.username, password: secret})
        .then( () => this.onMatrixConnect() )
        .catch( () => window.notify("authentication was not succesful 😞"))
      }else this.onMatrixConnect()
    }
  },

  onMatrixConnect(){
    // token: this.matrixclient.getAccessToken()
    frontend.emit('network.info',{message:'🛰 syncing with Matrix (might take a while)',plugin:this}) 
    frontend.emit('network.connected',{plugin:this,username: this.username}) 
    this.client.startClient({ initialSyncLimit: 4 }) // show last 4 messages?
    // get roomId of channel
    this.client.getRoomIdForAlias(this.channel)
    .then( (o) => {
      this.roomId = o.room_id
      this.setupListeners()
    })
    .catch((e) => {
      frontend.emit('network.error',{plugin:this,message:`channel ${this.channel} cannot be joined: `+String(e)}) 
    })
  },

  setupCRDT(){
    // Create a new Y.Doc and connect the MatrixProvider
    this.ydoc = new Matrix.Y.Doc();
    const provider = new Matrix.MatrixProvider(this.ydoc, this.client, {
      type: "alias",
      alias: this.channel 
    });
    provider.initialize();

    this.yhref = this.ydoc.getText('href')
    // observe changes of the sum
    this.yhref.observe((event) => {
      console.log("new yhref: " + yhref.toString );
    });
    debugger

  },

  getNormalizedName(){
    return this.channel.replace(/(^#|:.*)/,'')
  },

  setupListeners(){
    if( this.useChat ) this.setupChat()
    //if( this.useScene ) this.setupCRDT() /* throws weird errors, perhaps matrix-sdk-js is too new */
    return this
  },

  setupChat(){

    // receive receivemessages
    this.client.on("Room.timeline", (event, room, toStartOfTimeline) => {
      if (event.getType() !== "m.room.message") return // only print messages
      if( room.roomId == this.roomId ){
        $chat.send({message: event.getContent().body, from: event.getSender()})
      }
    });

    // send chatmessages
    document.addEventListener('network.send', (e) => {
      let {message} = e.detail
      let href = frontend.share({linkonly:true}) // get our meetinglink in there
      // convert to absolute links
      if( message.match(/href="#/) ){
        message  = message.replace(/href=['"]#.*?['"]/g, `href="${href}"`)
      }else{
        let pos = []
        if( network.posName ){
          pos.push(`<a href="${href}">#${network.posName}</a>`)
        }
        if( network.pos ){
          pos.push(`<a href="${href}">#${`pos=${network.pos}`}</a>`)
        }
        if( pos.length ) message += `<br>📍 ${pos.join(' ')}`
      }
      let content = { 
        body: message, 
        format: "org.matrix.custom.html",
        formatted_body: message,
        msgtype:"m.text" 
      }
      this.client.sendEvent( this.roomId, "m.room.message", content, "", (err,res) =>  console.error(err) )
    })

  },

  config(opts){
    opts = {...opts, ...this.profile }
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
    window.notify(`${this.profile.name} is ${this.profile.description}, it is the hottest internet technology available at this moment.<br>Read more about it <a href="${this.profile.url}" target="_blank">here</a>.<br>You can basically make up a new channelname or use an existing one`)
  },

  parseLink(url){
    if( !url.match(this.profile.protocol) ) return
    let parts = url.replace(this.profile.protocol,'').split("/")
    if( parts[0] == 'r' ){ // room
      let server  = parts[1].replace(/:.*/,'') 
      let channel = parts[1].replace(/.*:/,'')
      $connections.show()
      $connections.selectedChatnetwork        = this.profile.name
      $connections.selectedScene              = this.profile.name
      this.el.querySelector('#channel').value = `#${channel}:${server}`
      this.el.querySelector('#server').value  = server 
      console.log("configured matrix")
    }
    return false
  },

  createLink(opts){
    let hash = document.location.hash 
    if( !this.link ){
      const meeting = network.getMeetingFromUrl(document.location.href)
      this.link = meeting.match("matrix://") ? meeting  : ''
    }
    if( !hash.match('meet=') ) document.location.hash += `${hash.length > 1 ? '&' : '#'}meet=${this.link}`
  },

  reactToConnectionHrefs(){
    xrf.addEventListener('href', (opts) => {
      let {mesh} = opts
      if( !opts.click ) return
      this.parseLink(mesh.userData.href)
      let href = mesh.userData.href
      let isLocal    = href[0] == '#'
      let isTeleport = href.match(/(pos=|http:)/)
      if( isLocal && !isTeleport && this.client && this.useScene ){
        console.log("sending href")
        this.yhref.set( document.location.hash )
      } 
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

