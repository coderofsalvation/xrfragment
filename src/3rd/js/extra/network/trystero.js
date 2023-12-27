window.trystero = (opts) => new Proxy({

  plugin:{
    type: 'network',
    name: 'Peer2Peer',
    description: 'P2P using WebRTC over bittorrent for signaling & encryption',
    url: 'https://github.com/dmotz/trystero',
    video: true,
    audio: true,
    chat: true,
    scene: true
  },

  html: {
    generic: (opts) => `<table id="trystero">
          <tr>
            <td><a href="${opts.url}" target="_blank" class="badge">P2P</a></td>
            <td>
              <input type="text" id="channelname" placeholder="channel name"/>
            </td>
          </tr>
        </table>
      </div>
    `
  },

  handle: null, // { selfId: .... } when connected
  link:   null,
  selfId: null,
  connected: false,
  names:  {},
  chat:   { send: null, get: null },
  name:   { send: null, get: null },

  init(){
    let network = window.network
    network.plugin['trystero'] = this
    $connections.webcam = $connections.webcam.concat([this])
    $connections.chatnetwork = $connections.chatnetwork.concat([this])
    $connections.scene       = $connections.scene.concat([this])
  },

  connect(){
    // embedded https://github.com/dmotz/trystero (trystero-torrent.min.js build)
    console.dir(opts)
    this.handle     = joinRoom( room.config, room.link )
    this.send({message:'📡 [trystero] opening P2P WebRTC-channel via bittorrent',class:['info']})
  },

  send(opts){ $chat.send({...opts, source: 'trystero'}) },

  config(opts){
    opts = {...opts, ...this.plugin }
    let el   = document.createElement('div')
    let html = this.html.generic(opts)
    for( let i in opts ){
      if( this.html[i] ) html += this.html[i](opts)
    }
    el.innerHTML = html
    el.addEventListener('mouseover', () => {
      window.notify(`${opts.name} is ${opts.description} <br>by using a serverless technology called <a href="${opts.url}" target="_blank">trystero</a>.<br>You can basically make up your own channelname or choose an existing one`)
    })
    return el
  }

},
{ 
  // auto-trigger events on changes 
  get(data,k,receiver){ return data[k] },
  set(data,k,v){
    let from   = data[k]
    data[k] = v
    switch( k ){
      default: trystero.opts.scene.dispatchEvent({type:`trystero.${k}.change`, from, to:v})
    }
  }
})
      
document.addEventListener('$connections:ready', (e) => {
  trystero(e.detail).init()
})

//window.meeting = window.meeting||{}
//window.meeting.trystero = async function(el,com,data){
//
//  // embed https://github.com/dmotz/trystero (trystero-torrent.min.js build)
//  const { joinRoom } = await import("./../../../dist/trystero-torrent.min.js");
//  this.room  = {
//    handle: null,
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
//    if( this.room.handle ) this.room.handle.leave()
//  })
//
//  el.addEventListener('connect', async () => {
//    let room = this.room
//    
//    room.link = this.data.link
//    if( !room.linkmatch(/(#|&)meet/) ){
//      room.link = room.link.match(/#/) ? '&meet' : '#meet'
//    }
//    room.handle     = joinRoom( room.config, room.link )
//    room.selfId     = room.handle.selfId
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
//    const [sendName, getName] = room.makeAction('name')
//    const [sendChat, getChat] = room.makeAction('chat')
//    room.chat.send = sendChat
//    room.chat.get  = getChat
//    room.name.send = sendName
//    room.name.get  = getName
//
//    // tell other peers currently in the room our name
//    room.names[ room.selfId ] = com.data.visitorname.substr(0,15)
//    room.name.send( com.data.visitorname )
//
//    // listen for peers naming themselves
//    this.name.get((name, peerId) => (room.names[peerId] = name))
//
//    // send self stream to peers currently in the room
//    room.addStream(com.selfStream)
//
//    // send stream + chatlog to peers who join later
//    room.onPeerJoin( (peerId) => {
//      room.addStream( com.selfStream, peerId)
//      room.name.send( com.data.visitorname, peerId)
//      room.chat.send({prime: com.log}, peerId )
//    })
//
//    room.onPeerLeave( (peerId) => {
//      console.log(`${room.names[peerId] || 'a visitor'} left`)
//      if( com.videos[peerId] ){
//        com.videos[peerId].remove()
//        delete com.videos[peerId]
//      }
//      delete room.names[peerId]
//    })
//
//    // handle streams from other peers
//    room.onPeerStream((stream, peerId) => {
//      // create an audio instance and set the incoming stream
//      const audio = new Audio()
//      audio.srcObject = stream
//      audio.autoplay = true
//      // add the audio to peerAudio object if you want to address it for something
//      // later (volume, etc.)
//      com.data.audios[peerId] = audio
//    })
//
//    room.onPeerStream((stream, peerId) => {
//      com.createVideoElement(stream,peerId)
//    })
//
//    // listen for chatmsg 
//    room.chat.get((data, peerId) => {
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
