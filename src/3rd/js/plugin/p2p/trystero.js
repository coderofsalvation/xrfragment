window.trystero = (opts) => new Proxy({

  profile:{
    type: 'network',
    name: 'Peer2Peer',
    description: 'WebRTC over bittorrent for signaling & encryption',
    url: 'https://github.com/dmotz/trystero',
    protocol: 'trystero://',
    video: true,
    audio: true,
    chat: true,
    scene: true
  },

  html: {
    generic: (opts) => `<div>
        <div target="_blank" class="badge ruler">Peer2Peer<a onclick="frontend.plugin.trystero.info()"><i class="gg-info right"></i></a></div>
        <table>
          <tr>
            <td>nickname</td>
            <td>
              <input type="text" id="nickname" placeholder="your nickname" maxlength="18" onkeydown="trystero.nickname = this.value"/>
            </td>
          </tr>
        </table>
      </div>
    `
  },

  room:       null, // { selfId: .... } when connected
  link:       '',
  selfId:     null,
  selfStream: null,
  nickname:   '',
  connected:  false,

  useWebcam: false,
  useChat:   false,
  useScene:  false,

  videos:    {},

  names:  {},
  ping:   { send: null, get: null },
  chat:   { send: null, get: null },
  name:   { send: null, get: null },
  href:   { send: null, get: null },

  init(){
    frontend.plugin['trystero'] = this
    $connections.webcam      = $connections.webcam.concat([this])
    $connections.chatnetwork = $connections.chatnetwork.concat([this])
    $connections.scene       = $connections.scene.concat([this])
    if( localStorage.getItem("selfId") ){
      this.selfId = localStorage.getItem("selfId")
    }else{
      this.selfId = String(Math.random()).substr(2)
      localStorage.setItem("selfId",this.selfId)
    }
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

  confirmConnected(){
    if( !this.connected ){
      this.connected = true
      frontend.emit('network.connected',{plugin:this,username: this.nickname}) 
      this.names[ this.selfId ] = this.nickname
    }
  },

  async connect(opts){
    // embedded https://github.com/dmotz/trystero (trystero-torrent.min.js build)
    if( opts.selectedWebcam      == this.profile.name ) this.useWebcam = true
    if( opts.selectedChatnetwork == this.profile.name ) this.useChat   = true
    if( opts.selectedScene       == this.profile.name ) this.useScene  = true
    if( this.useWebcam || this.useChat || this.useScene ){
      this.createLink() // ensure link 
      console.log("connecting "+this.profile.name)

      console.log("trystero link: "+this.link)
      this.room        = joinRoom( {appId: 'xrfragment'}, this.link )
      
      $chat.send({message:`Share the meeting link <a onclick="frontend.share()">by clicking here</a>`,class:['info'],timeout:10000})
      $chat.send({message:"waiting for other humans..",class:['info'], timeout:5000})

      // setup trystero events
      const [sendPing, getPing] = this.room.makeAction('ping')
      this.ping.send = sendPing
      this.ping.get  = getPing

      const [sendName, getName] = this.room.makeAction('name')
      this.name.send = sendName
      this.name.get  = getName

      // start pinging
      this.ping.pinger = setInterval( () => this.ping.send({ping:true}), 3000 )
      this.ping.get((data,peerId) => this.confirmConnected() )

      // listen for peers naming themselves
      this.name.get((name, peerId) => {
        this.confirmConnected()
        this.names[peerId] = name
      })
      // send name to peers who join later
      this.room.onPeerJoin( (peerId) => {
        this.confirmConnected()
        this.names[peerId] = name
        this.name.send(this.nickname, peerId ) 
        $chat.send({message:"a new human joined",class:['info']})
      })
      // delete name of people leaving
      this.room.onPeerLeave( (peerId) => delete this.names[peerId] )
  
      if( this.useWebcam ) this.initWebcam()
      if( this.useChat )   this.initChat()
      if( this.useScene )  this.initScene()

    }
  },

  initChat(){
    const [sendChat, getChat] = this.room.makeAction('chat')
    this.chat.send = sendChat
    this.chat.get  = getChat

    document.addEventListener('network.send', (e) => {
      this.chat.send({...e.detail, from: this.nickname, pos: network.pos })                     // send to P2P network
    })
    // prime chatlog of other people joining
    this.room.onPeerJoin( (peerId) => {
      if( $chat.getChatLog().length > 0 ) this.chat.send({prime: $chat.getChatLog() }, peerId )
    })
    // listen for chatmsg 
    this.chat.get((data, peerId) => {
      if( data.prime ){   // first prime is 'truth'
        if( this.chat.primed || $chat.getChatLog().length > 0 ) return // only prime once
        $chat.$messages.innerHTML += data.prime
        $chat.$messages.scrollTop = $chat.$messages.scrollHeight // scroll down
        this.chat.primed = true
      }else $chat.send({ ...data})          // send to screen
    })

  },

  async initWebcam(){
    if( !$connections.$audioInput.value && !$connections.$videoInput.value ) return  // nothing to do

    // get a local audio stream from the microphone
    this.selfStream = await navigator.mediaDevices.getUserMedia({
      audio: $connections.$audioInput.value, 
      video: $connections.$videoInput.value 
    })
    this.room.addStream(this.selfStream) 
    this.videos[ this.selfId ] = this.getVideo(this.selfId,{stream: this.selfStream})

    // send stream + chatlog to peers who join later
    this.room.onPeerJoin( (peerId) => this.room.addStream( this.selfStream, peerId))

    this.room.onPeerStream((stream, peerId) => {
      let video = this.getVideo(peerId,{create:true, stream}) 
      this.videos[ this.names[peerId] || peerId ] = video
    })

    this.room.onPeerLeave( (peerId) => {
      let video = this.getVideo(peerId)
      if( video ){
        video.remove() 
        delete this.videos[peerId]
      }
    })

  },

  initScene(){
    // setup trystero events
    const [sendHref, getHref] = this.room.makeAction('name')
    this.href.send = sendHref
    this.href.get  = getHref
    this.href.get((data,peerId) => {
      xrf.hashbus.pub(data.href)      
    })
  },

  getVideo(peerId,opts){
    opts = opts || {}
    let video = this.videos[ this.names[peerId] ] || this.videos[ peerId ]
    if (!video && opts.create) {
      video = document.createElement('video')
      video.autoplay = true

      // add video element to the DOM
      if( opts.stream ) video.srcObject = opts.stream 
      console.log("creating video for peerId")
      $chat.$videos.appendChild(video)
    }
  },

  send(opts){ $chat.send({...opts, source: 'trystero'}) },

  createLink(opts){
    let hash = document.location.hash 
    if( !this.link ){
      const meeting = network.getMeetingFromUrl(document.location.href)
      this.link = meeting.match("trystero://") ? meeting : `trystero://r/${network.randomRoom()}:bittorrent`
    }
    if( !hash.match('meet=') ) document.location.hash += `${hash.length > 1 ? '&' : '#'}meet=${this.link}`
  },

  config(opts){
    opts = {...opts, ...this.profile }
    this.el   = document.createElement('div')
    this.el.innerHTML = this.html.generic(opts)
    this.el.querySelector('#nickname').value = this.nickname
    this.el.querySelector('#nickname').addEventListener('change', (e) => localStorage.setItem("nickname",e.target.value) )
    // resolve ip
    return this.el
  },

  info(opts){
    window.notify(`${this.profile.name} is ${this.profile.description} <br>by using a serverless technology called <a href="https://webrtc.org/" target="_blank">webRTC</a> via <a href="${this.profile.url}" target="_blank">trystero</a>.<br>You can basically make up your own channelname or choose an existing one.<br>Use this for hasslefree anonymous meetings.`)
  },

  parseLink(url){
    if( !url.match(this.profile.protocol) ) return
    let parts = url.replace(this.profile.protocol,'').split("/")
    if( parts[0] == 'r' ){ // this.room
      let roomid = parts[1].replace(/:.*/,'') 
      let server = parts[1].replace(/.*:/,'')
      if( server != 'bittorrent' ) return window.notify("only bittorrent is supported for trystero (for now) :/") 
      this.link = url
      $connections.show({
        chatnetwork:this.profile.name,
        scene:      this.profile.name,
        webcam:     this.profile.name 
      })
      return true
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
    //  default: elcene.dispatchEvent({type:`trystero.${k}.change`, from, to:v})
    //}
  }
})
      
document.addEventListener('$connections:ready', (e) => {
  trystero(e.detail).init()
})

//window.meeting = window.meeting||{}
//window.meeting.trystero = async function(el,this){
//
//  // embed https://github.com/dmotz/trystero (trystero-torrent.min.js build)
//  const { joinRoom } = await import("./../../../dist/trystero-torrent.min.js");
//  this.room  = {
//    this.room: null,
//    link:   null,
//    selfId: null,
//    names:  {},
//    chat:   { send: null, get: null },
//    name:   { send: null, get: null },
//    config: {appId: this.data.id }
//  }
//
//  this.sendName = null
//
//  this.send = (opts) => com.send({...opts, source: 'trystero'})
//
//  el.addEventListener('remove', () => {
//    if( this.room.room ) this.room.room.leave()
//  })
//
//  el.addEventListener('connect', async () => {
//    let this.room = this.room
//    
//    this.room.link = this.data.link
//    if( !room.linkmatch(/(#|&)meet/) ){
//      this.room.link = this.room.link.match(/#/) ? '&meet' : '#meet'
//    }
//    this.room.room     = joinRoom( this.room.config, this.room.link )
//    this.selfId     = this.room.selfId
//
//    this.send({
//      message: "joined meeting at "+roomname.replace(/(#|&)meet/,''),  // dont trigger init()
//      classes: ["info"],
//      sendNetwork:false
//    })
//
//    this.send({
//      message:"copied meeting link to clipboard",
//      classes: ["info"],
//      sendNetwork:false
//    })
//
//    // setup trystero events
//    const [sendName, getName] = this.room.makeAction('name')
//    const [sendChat, getChat] = this.room.makeAction('chat')
//    this.chat.send = sendChat
//    this.chat.get  = getChat
//    this.name.send = sendName
//    this.name.get  = getName
//
//    // tell other peers currently in the this.room our name
//    this.names[ this.selfId ] = this.nickname.substr(0,15)
//    this.name.send( this.nickname )
//
//    // listen for peers naming themselves
//    this.name.get((name, peerId) => (room.names[peerId] = name))
//
//    // send self stream to peers currently in the this.room
//    this.room.addStream(this.selfStream)
//
//    // send stream + chatlog to peers who join later
//    this.room.onPeerJoin( (peerId) => {
//      this.room.addStream( this.selfStream, peerId)
//      this.name.send( this.nickname, peerId)
//      this.chat.send({prime: com.log}, peerId )
//    })
//
//    this.room.onPeerLeave( (peerId) => {
//      console.log(`${room.names[peerId] || 'a visitor'} left`)
//      if( com.videos[peerId] ){
//        com.videos[peerId].remove()
//        delete com.videos[peerId]
//      }
//      delete this.names[peerId]
//    })
//
//    // this.room streams from other peers
//    this.room.onPeerStream((stream, peerId) => {
//      // create an audio instance and set the incoming stream
//      const audio = new Audio()
//      audio.srcObject = stream
//      audio.autoplay = true
//      // add the audio to peerAudio object if you want to address it for something
//      // later (volume, etc.)
//      this.audios[peerId] = audio
//    })
//
//    this.room.onPeerStream((stream, peerId) => {
//      com.createVideoElement(stream,peerId)
//    })
//
//    // listen for chatmsg 
//    this.chat.get((data, peerId) => {
//      if( data.prime ){
//        if( com.log.length > 0 ) return                // only prime once
//        console.log("receiving prime")
//        data.prime.map( (l) => this.send({message:l, sendLocal:false ) ) // send log to screen
//        this.chat.primed = true
//      }
//      this.send({ ...data, sendLocal: false})          // send to screen
//    })
//
//  }
//
//
//}
