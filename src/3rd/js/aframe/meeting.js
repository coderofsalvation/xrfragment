AFRAME.registerComponent('meeting', {
  schema:{
    id:{ required:true, type:'string'},
    visitorname:{required:false,type:'string'},
    parentRoom:{required:false,type:'string'}
  },
  remove: function(){
    if( this.room ) this.room.leave()
    this.meeting.remove()
  },
  update: function(){
    setTimeout( () => {
      this.remove()
      this.init()
    },100)
  },
  init: function(){
    // embed https://github.com/dmotz/trystero (trystero-torrent.min.js build)

    // add css+html
    let el = this.meeting = document.createElement("div")
    el.id  = 'meeting'
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
        bottom: 88px;
        padding: 15px;
        pointer-events: none;
        overflow-y:auto;
      }
      #chat .msg{
        background: #fff;
        display: inline-block;
        padding: 6px 17px;
        border-radius: 20px;
        color: #000c;
        margin-bottom: 10px;
        line-height:23px;
        pointer-events:visible;
        border: 1px solid #ccc;
      }
      #chat .msg.info{
        background: #333;
        color: #FFF;
        font-size: 14px;
        font-weight: bold;
        padding: 0px 16px;
      }
      #chat .msg.info a,
      #chat .msg.info a:visited{
        color: #aaf;
        text-decoration: none;
        transition:0.3s;
      }
      #chat .msg.info a:hover,
      #chat button:hover{
        filter: brightness(1.8);
        text-decoration: underline;
      }
      #chat button {
        margin: 0px 15px 10px 0px;
        background: #07F;
        color: #FFF;
        border-radius: 7px;
        padding: 11px 15px;
        border: 0;
        font-weight: bold;
        box-shadow: 0px 0px 5px 5px #0002;
        pointer-events:all;
      }
      #chat,#chatbar,#chatbar *, #chat *{
        font-family:monospace;
        font-size:15px;
      }
    </style>
    <div id="videos" style="pointer-events:none"></div>
    <div id="chat" aria-live="assertive" aria-relevant></div>
    <div id="chatbar">
      <input id="chatline" type="text" placeholder="enter your name"></input>
    </div>`
    document.body.appendChild(el)

    let chatline   = this.chatline = document.querySelector("#chatline")
    let chat       = this.chat     = document.querySelector("#chat")
    chat.log = []  // save raw chatlog to prime new visitors
    chat.append = (str,classes,buttons) => this.chatAppend(str,classes,buttons)
 
    this.initChatLine()

    if( !this.data.visitorname ) this.chat.append("Please enter your name below",["info"])
    else{
      if( this.data.parentRoom ) this.chat.append(`leaving ${this.data.parentRoom}`,["info"]);
      this.trysteroInit()
    }
  }, 

  chatAppend: function(str,classes,buttons){
    if( str ){
      str = str.replace('\n', "<br>")
               .replace(/^[a-zA-Z-0-9]+?[:\.]/,'<b>$&</b>')
      let el = this.createMsg(str)
      if( classes ) classes.map( (c) => el.classList.add(c) )
      this.chat.appendChild(el) // send to screen
      this.chat.innerHTML += '<br>'
      this.chat.log.push(str)
    }
    if( buttons ){
      for( let i in buttons ){
        let btn = document.createElement("button")
        btn.innerText = i 
        btn.addEventListener('click', () => buttons[i]() )
        this.chat.appendChild(btn)
      }
      this.chat.innerHTML += '<br>'
    }
    this.chat.scrollTop = this.chat.scrollHeight; // scroll to bottom
  },

  trysteroInit: async function(){
    const { joinRoom } = await import("./../../../dist/trystero-torrent.min.js");

    if( !document.location.hash.match(/meet/) ){
      document.location.hash += document.location.hash.match(/#/) ? '&meet' : '#meet'
    }
    let roomname   = this.roomname = document.location.href
    const config   = this.config = {appId: this.data.id }
    const room     = this.room   = joinRoom(config, roomname )
    this.chat.append("joined meeting at "+roomname,["info"]);
    this.chat.append("copied meeting link to clipboard",["info"]);

    const idsToNames = this.idsToNames = {}
    const [sendName, getName] = room.makeAction('name')
    const [sendChat, getChat] = this.room.makeAction('chat')
    this.sendChat = sendChat
    this.sendName = sendName
    this.getChat  = getChat
    this.getName  = getName

    // tell other peers currently in the room our name
    idsToNames[ room.selfId ] = this.data.visitorname.substr(0,15)
    sendName( this.data.visitorname )

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

  createMsg: function(str){
    let el = document.createElement("div")
    el.className = "msg"
    el.innerHTML = this.linkify(str) 
    return el
  },

  // central function to broadcast stuff to chat
  send: function(str,classes,buttons){
    if( !this.sendChat ) return
    this.sendChat({content:str})          // send to network
    this.chat.append(str,classes,buttons) // send to screen
  },

  initChatLine: function(){
    let chatline   = this.chatline = document.querySelector("#chatline")
    chatline.addEventListener("keydown", (e) => {
      if( e.key !== "Enter" ) return 
      if( !this.data.visitorname ){
        this.data.visitorname = chatline.value
        this.chat.append("note: camera/mic access is totally optional ♥️",["info"])
        this.trysteroInit()
      }else{
        let str = `${this.idsToNames[ this.room.selfId ]}: ${chatline.value.substr(0,65515).trim()}`
        this.send(str)
      }
      chatline.value = ''
      event.preventDefault();
      event.target.blur()
    })
  },

  initChat: function(){
    // listen for chatmsg 
    this.getChat((data, peerId) => {
      if( data.prime ){
        if( this.chat.primed ) return              // only prime once
        console.log("receiving prime")
        data.prime.map( (l) => chat.append(l) ) // send log to screen
        this.chat.primed = true
      }
      chat.append(data.content,data.classes,data.buttons) // send to screen
    })

    this.notifyTeleport()
    return this
  },

  notifyTeleport: function(buttons){
    // send to network
    this.sendChat({
      content: `${this.data.visitorname} teleported to ${this.roomname}`,
      classes: ["info"], 
      buttons
    })
  },

  linkify: function(t){
    const m = t.match(/(?<=\s|^)[a-zA-Z0-9-:/]+[?\.][a-zA-Z0-9-].+?(?=[.,;:?!-]?(?:\s|$))/g)
    if (!m) return t
    const a = []
    m.forEach(x => {
      const [t1, ...t2] = t.split(x)
      a.push(t1)
      t = t2.join(x)
      let y = (!(x.match(/:\/\//)) ? 'https://' : '') + x
      let attr = 'target="_blank"'
      if (isNaN(x) ){
        let url_human    = y.split('/')[2] 
        let isXRFragment = y.match(/\.(glb|gltf|obj|usdz|fbx|col)/)
        if( isXRFragment ){               // detect xr fragments
          isMeeting = y.match(/(#|&)meet/)
          url_human  = y.replace(/.*[?\?]/,'')   // shorten xr fragment links
                       .replace(/[?\&]meet/,'')
          y   = y.replace(/.*[\?]/, '?')        // start from search (to prevent page-refresh)
          attr = ''
          if( isMeeting ) attr = `onclick="$('[meeting]').components['meeting'].update()"`
        }
        a.push(`<a href="${y}" ${attr} style="pointer-events:all">${url_human}</a>`)
      }else
        a.push(x)
    })
    a.push(t)
    return a.join('')
  }

});
