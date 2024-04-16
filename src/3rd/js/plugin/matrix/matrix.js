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
    scene: true
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
              <input type="text" id="channel" placeholder="${opts.plugin.channel}" value="${opts.plugin.channel}"/>
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
              <input type="text" id="username" placeholder="@you:matrix.org" value="${opts.plugin.username}"/>
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
    $connections.scene       = $connections.scene.concat([this])
    if( window.localStorage.getItem("username") ) this.username = window.localStorage.getItem("username")
    this.reactToConnectionHrefs()

    document.addEventListener('network.connect', (e) => this.connect(e.detail) )
    document.addEventListener('network.init', () => {
      let meeting = network.getMeetingFromUrl(document.location.href)
      if( meeting.match(this.profile.protocol) ){
        this.parseLink( meeting )
      }
    })
  },

  connect(opts){
    if( opts.selectedWebcam      == this.profile.name ) this.useWebcam = true
    if( opts.selectedChatnetwork == this.profile.name ) this.useChat   = true
    if( opts.selectedScene       == this.profile.name ) this.useScene  = true
    if( this.useWebcam || this.useScene || this.useChat ){
      this.link = `matrix://r/${this.channel.replace(/^#/,'')}`
      this.createLink() // ensure link 
      this.channel  = document.querySelector("#matrix input#channel").value
      this.server   = document.querySelector("#matrix input#server").value
      this.username = document.querySelector("#matrix input#username").value
      this.auth     = document.querySelector("#matrix select#auth").value

      localStorage.setItem("matrix.username",this.username)
      let secret    = document.querySelector("#matrix input#secret").value
      document.querySelector("#matrix input#secret").value = ''

      let clientOpts =  { 
        baseUrl: this.server.match(/^http/) ? this.server : `https://${this.server}`,
        lazyLoadMembers: true,
      }

      if( this.auth == 'via access token'){
        clientOpts.accessToken = secret 
        clientOpts.userId      = this.username
      }

      this.client = Matrix.sdk.createClient(clientOpts)
      // auth
      if( this.auth == 'via password'){
        //this.client.loginWithPassword(this.username, secret)
        this.client.login("m.login.password",{"user": this.username, password: secret})
        .then( () => this.onMatrixConnect() )
        .catch( () => {
           window.notify("authentication was not succesful 😞") 
        })
      }else {
        this.onMatrixConnect()
        //this.client.loginWithToken(clientOpts.accessToken)
        //.then( () => this.onMatrixConnect() )
        //.catch( () => {
        //   window.notify("authentication was not succesful 😞") 
        //})
      }

    }
  },

  onMatrixConnect(){
    // Extra configuration needed for certain matrix-js-sdk (we don't call start)
    // calls to work without calling sync start functions
    this.client.canSupportVoip = false;
    this.client.clientOpts = {
      lazyLoadMembers: true
    }
    //this.client.startClient({ initialSyncLimit: 4 }) // show last 4 messages?
    //.then( () => {
    //.catch( (e) => window.notify("could not start matrix client 😞"))

    console.log("onmatrix connect")
    // token: this.matrixclient.getAccessToken()
    frontend.emit('network.info',{message:'🛰 syncing with Matrix (might take a while)',plugin:this}) 
    //this.client.once("sync", function (state, prevState, res) { });
    frontend.emit('network.connected',{plugin:this,username: this.username}) 
    // get roomId of channel
    this.client.getRoomIdForAlias(this.channel)
    .then( (o) => {
      console.log(`${this.channel} has id ${o.room_id}`)
      this.roomId = o.room_id
      // join room if we haven't already
      this.client.joinRoom(this.roomId)
      .then( () => this.setupListeners() )
      .catch( () => this.setupListeners() )
    })
    .catch((e) => {
      console.error(e)
      frontend.emit('network.error',{plugin:this,message:`channel ${this.channel} cannot be joined: `+String(e)}) 
    })
  },

  setupCRDT(){
    // Create a new Y.Doc and connect the MatrixProvider
    var Buffer = window.Buffer = Matrix.Buffer // expose to MatrixProvider
    this.ydoc = new Matrix.Y.Doc();
    const provider = new Matrix.MatrixProvider(this.ydoc, this.client, {
      type: "alias",
      alias: this.channel 
    });
    provider.initialize();

    this.ydoc.scene = this.ydoc.getMap('scene')
    // observe changes of the sum
    this.ydoc.scene.observe(ymapEvent => {

      // Find out what changed: 
      // Option 1: A set of keys that changed
      ymapEvent.keysChanged // => Set<strings>
      // Option 2: Compute the differences
      ymapEvent.changes.keys // => Map<string, { action: 'add'|'update'|'delete', oldValue: any}>

      // sample code.
      ymapEvent.changes.keys.forEach((change, key) => {
        console.dir({key,change})
        if ( key == 'href' && change.action != "delete" ){
          let href = this.ydoc.scene.get('href')
          if( href.match(/pos=/) ) return // no shared teleporting
          xrf.hashbus.pub(href)
        } else if (change.action === 'delete') {
          console.log(`Property "${key}" was deleted. New value: undefined. Previous value: "${change.oldValue}".`)
        }
      })
    })

  },

  getNormalizedName(){
    return this.channel.replace(/(^#|:.*)/,'')
  },

  setupListeners(){
    if( this.useChat ) this.setupChat()
    if( this.useScene ) this.setupCRDT() /* throws weird errors, perhaps matrix-sdk-js is too new */
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
      this.client.sendEvent( this.roomId, "m.room.message", content, "", (err,res) =>  console.error({err,res}) )
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
    if( url.match('/r/') ){
      this.link = url
      let parts = url.split("/r/")
      let channel = parts[1].replace(/:.*/,'') 
      let server  = parts[1].replace(/.*:/,'')
      $connections.show({
        chatnetwork:this.profile.name,
        scene:      this.profile.name,
        webcam:     "No thanks"
      })
      this.el.querySelector('#channel').value = `#${channel}:${server}`
      this.el.querySelector('#server').value  = server 
      if( window.localStorage.getItem("matrix.username") ){
        this.el.querySelector('#username').value = window.localStorage.getItem("matrix.username")
      }
      console.log("configured matrix")
      return true
    }
    return false
  },

  createLink(opts){
    if( !this.link ){
      const meeting = network.getMeetingFromUrl(document.location.href)
      this.link = network.meetingLink = meeting.match("matrix://") ? meeting  : ''
    }
    if( !xrf.navigator.URI.hash.meet ) xrf.navigator.URI.hash.meet = this.link 
  },

  reactToConnectionHrefs(){
    xrf.addEventListener('href', (opts) => {
      let {mesh} = opts
      if( !opts.click ) return
      let detected = this.parseLink(mesh.userData.href)
      if( detected ) opts.promise() // don't resolve, ignore other listeners
      let href = mesh.userData.href
      let isLocal    = href[0] == '#'
      let isTeleport = href.match(/(pos=|http:)/)
      if( isLocal && !isTeleport && this.client && this.useScene && this.ydoc ){
        this.ydoc.scene.set('href',document.location.hash )
      } 
    })
    let hashvars = xrf.URI.parse( document.location.hash ).XRF
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

