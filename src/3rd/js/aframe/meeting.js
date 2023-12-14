AFRAME.registerComponent('meeting', {
  schema:{
    id:{ required:true, type:'string'}
  },
  init: function(){
    // embed https://github.com/dmotz/trystero (trystero-torrent.min.js build)

    // add css+html
    let el = document.createElement("div")
    el.innerHTML += `<style type="text/css">
      #videos{
        display:grid-auto-columns;
        grid-column-gap:5px;
        margin-bottom:15px;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        margin: 15px;
        z-index:1500;
      }
      #videos > video{
        border-radius:7px;
        display:inline-block;
        background:black;
        width:80px;
        height:60px;
        margin-right:5px;
        margin-bottom:5px;
        vertical-align:top;
        pointer-events:all;
      }
      #videos > video:hover{
        filter: brightness(1.8);
        cursor:pointer;
      }
      #chatbar {
        z-index: 1500;
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 48%;
        background: white;
        padding: 0px 0px 0px 15px; 
        border-radius: 30px;
        max-width: 500px;
        box-sizing: border-box;
        box-shadow: 0px 0px 5px 5px #0002;
      }
      #chatbar input{
        border:none;
        width:90%;
        box-sizing:border-box;
      }
      #chat{
        position: absolute;
        top: 100px;
        left: 0;
        right: 0;
        bottom: 110px;
        padding: 15px;
        pointer-events: none;
      }
      #chat .msg{
        background: #fffc;
        display: inline-block;
        padding: 6px 17px;
        border-radius: 20px;
        color: #000c;
        margin-bottom: 10px;
      }
      #chat,#chatbar,#chatbar *, #chat *{
        font-family:monospace;
        font-size:15px;
      }
    </style>
    <div id="videos" style="pointer-events:none"></div>
    <div id="chat" aria-live="assertive" aria-relevant></div>
    <div id="chatbar">
      <input id="chatline" type="text" placeholder="chat here"></input>
    </div>`
    document.body.appendChild(el)
    this.trysteroInit()
  }, 

  trysteroInit: async function(){
    const { joinRoom } = await import("./../../../dist/trystero-torrent.min.js");

    const roomname = document.location.href.replace(/#.*/,'')
    const config   = this.config = {appId: this.data.id }
    const room     = this.room   = joinRoom(config, roomname )
    console.log("starting webrtc room: "+roomname)

    const idsToNames = this.idsToNames = {}
    const [sendName, getName] = room.makeAction('name')
    const [sendChat, getChat] = this.room.makeAction('chat')
    this.sendChat = sendChat
    this.sendName = sendName
    this.getChat  = getChat
    this.getName  = getName

    // tell other peers currently in the room our name
    let name = this.name = prompt('enter your name:')
    idsToNames[ room.selfId ] = name.substr(0,15)
    sendName( name )

    // listen for peers naming themselves
    getName((name, peerId) => (idsToNames[peerId] = name))

    this.initChat()

    // this object can store audio instances for later
    const peerAudios = this.peerAudios = {}
    const peerVideos = this.peerVideos = {}
    // get a local audio stream from the microphone
    const selfStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: {
          width: 320,
          height: 240,
          frameRate: {
              ideal: 30,
              min: 10
          }
      }
    })
    let meVideo   = this.addVideo(selfStream, room.selfId)
    meVideo.muted = true

    // send stream to peers currently in the room
    room.addStream(selfStream)

    // send stream + chatlog to peers who join later
    room.onPeerJoin( (peerId) => {
      console.log(`${idsToNames[peerId] || 'a visitor'} joined`)
      room.addStream(selfStream, peerId)
      sendName( name, peerId)
      this.sendChat({prime: this.chat.log}, peerId )
    })

    room.onPeerLeave( (peerId) => {
      console.log(`${idsToNames[peerId] || 'a visitor'} left`)
      if( peerVideos[peerId] ){
        peerVideos[peerId].remove()
        delete peerVideos[peerId]
      }
      delete idsToNames[peerId]
    })

    // handle streams from other peers
    room.onPeerStream((stream, peerId) => {
      // create an audio instance and set the incoming stream
      const audio = new Audio()
      audio.srcObject = stream
      audio.autoplay = true

      // add the audio to peerAudio object if you want to address it for something
      // later (volume, etc.)
      peerAudios[peerId] = audio
    })

    room.onPeerStream((stream, peerId) => {
      this.addVideo(stream,peerId)
    })

  },

  addVideo: function(stream,peerId){
    let video = this.peerVideos[peerId]
    const videoContainer = document.getElementById('videos')
    // if this peer hasn't sent a stream before, create a video element
    if (!video) {
      video = document.createElement('video')
      video.autoplay = true

      // add video element to the DOM
      videoContainer.appendChild(video)
    }

    video.srcObject = stream
    video.resize = (state) => {
      if( video.resize.state == undefined ) video.resize.state = false
      if( state == undefined ) state = (video.resize.state = !video.resize.state )
      video.style.width = state ? '320px' : '80px'
      video.style.height = state ? '200px' : '60px'
    }

    video.addEventListener('click', ()  => video.resize() )

    this.peerVideos[peerId] = video
    return video
  },

  createElement: function(str){
    let el = document.createElement("div")
    el.className = "msg"
    el.innerHTML = this.linkify(str) 
    return el
  },

  // central function to broadcast stuff to chat
  send: function(str){
    if( !this.sendChat ) return
    this.sendChat({content:str})      // send to network
    this.chat.append(str)             // send to screen
  },

  initChat: function(){

    let chatline   = this.chatline = document.querySelector("#chatline")
    let chat       = this.chat     = document.querySelector("#chat")
    chat.log = []  // save raw chatlog to prime new visitors
    chat.append = (str) => {
      if( !str ) return
      str = str.replace('\n', "<br>")
      this.chat.appendChild(this.createElement(str)) // send to screen
      this.chat.innerHTML += '<br>'
      this.chat.log.push(str)
    }

    let send = () => {
      let str = `${this.idsToNames[ this.room.selfId ]}: ${chatline.value.substr(0,65515).trim()}`
      this.send(str)
    }

    chatline.addEventListener("keydown", (e) => {
      if( e.key !== "Enter" ) return 
      send()
      chatline.value = ''
      event.preventDefault();
      event.target.blur()
    })

    // listen for chatmsg 
    this.getChat((data, peerId) => {
      if( data.prime ){
        if( this.chat.primed ) return              // only prime once
        console.log("receiving prime")
        data.prime.map( (l) => chat.append(l) ) // send log to screen
        this.chat.primed = true
      }
      chat.append(data.content) // send to screen
    })

    // notify join in chat 
    this.send( this.name+": joined")

    return this
  },

  linkify: function(t){
    const isValidHttpUrl = s => {
      let u
      try {u = new URL(s)}
      catch (_) {return false}
      return u.protocol.startsWith("http")
    }
    const m = t.match(/(?<=\s|^)[a-zA-Z0-9-:/]+\.[a-zA-Z0-9-].+?(?=[.,;:?!-]?(?:\s|$))/g)
    if (!m) return t
    const a = []
    m.forEach(x => {
      const [t1, ...t2] = t.split(x)
      a.push(t1)
      t = t2.join(x)
      const y = (!(x.match(/:\/\//)) ? 'https://' : '') + x
      if (isNaN(x) && isValidHttpUrl(y)) 
        a.push('<a href="' + y + '" target="_blank" style="pointer-events:all">' + y.split('/')[2] + '</a>')
      else
        a.push(x)
    })
    a.push(t)
    return a.join('')
  }

});
