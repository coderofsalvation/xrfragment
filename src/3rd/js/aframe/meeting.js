//
//AFRAME.registerComponent('meeting', {
//  schema:{
//    id:{ required:true, type:'string'},
//    visitorname:{required:false,type:'string'},
//    parentRoom:{required:false,type:'string'},
//    link:{required:false,type:'string'},
//  },
//
//  // reactive HTML elements
//  $:                document.createElement('div'),
//  cameras:          {},
//  audios:           {},
//  messages:         [],
//  placeholderInput: 'enter name here',
//  hideChat:         false,
//  log:              [],
//  selfStream:       null,
//
//  events:{
//    connect: function(e){
//      if( !this.data.visitorname ){
//        this.data.appendHTMLMessage("Please enter your name below",["info"])
//      }else{
//        if( this.data.parentRoom ) this.data.$chat.add(`leaving ${this.data.parentRoom}`,["info"]);
//      }
//    },
//  },
//
//  remove: function(){
//    this.el.emit("remove",{})
//    this.data.$.remove()
//  },
//
//  update: function(){
//    setTimeout( () => {
//      this.remove()
//      this.initMeeting()
//    },100)
//  },
//
//  init: function(){
//
//    //// when teleport is clicked
//    //AFRAME.XRF.addEventListener('href', (opts) => {
//    //  if( !opts.click ) return // ignore mouseovers etc
//    //  let url        = opts.xrf.string
//    //  let isTeleport = url.match(/(:\/\/|pos=)/)
//    //  if( isTeleport ){
//    //    url = url[0] == '#' ? document.location.href.replace(/#.*/, opts.xrf.string ) : '?'+opts.xrf.string
//    //    this.notifyTeleport( url )
//    //  }
//    //})
//    this.initMeeting()
//
//  },
//
//  initMeeting: function(){
//    this.data.link = document.location.href
//    this.initHTML()
//
//    // load plugins
//    if( window.meeting.trystero ) new window.meeting.trystero(this.el,this,this.data)
//
//    this.getMedia()
//    this.emit("connect",{})
//  },
//
//  getMedia: async function(){
//    this.data.selfStream = await navigator.mediaDevices.getUserMedia({
//      audio: true,
//      video: {
//          width: 320,
//          height: 240,
//          frameRate: {
//              ideal: 30,
//              min: 10
//          }
//      }
//    })
//    let meVideo   = this.createVideoElement(this.data.selfStream)
//    meVideo.muted = true
//  },
//
//  // central function to broadcast stuff to chat
//  send: function(opts){
//    opts = { sendLocal: true, sendNetwork:true, ...opts }
//    if( opts.sendNetwork ){
//      if( !this.sendChat ) return
//      this.sendChat({opts})          // send to network
//    }
//    if( opts.sendLocal ){
//      this.data.$chat.add( opts ) // send to HTML screen
//    }
//  },
//
//  createVideoElement: function(stream,id){
//    let video = this.data.videos[peerId]
//    const videoContainer = document.getElementById('videos')
//    // if this peer hasn't sent a stream before, create a video element
//    if (!video) {
//      video = document.createElement('video')
//      video.autoplay = true
//
//      // add video element to the DOM
//      videoContainer.appendChild(video)
//    }
//
//    video.srcObject = stream
//    video.resize = (state) => {
//      if( video.resize.state == undefined ) video.resize.state = false
//      if( state == undefined ) state = (video.resize.state = !video.resize.state )
//      video.style.width = state ? '320px' : '80px'
//      video.style.height = state ? '200px' : '60px'
//    }
//    this.data.videos[ id || 'me' ] = video
//    return video
//  },
//
//  initHTML: function(){
//
//    // add css
//    this.data.$.innerHTML += `<style type="text/css">
//      #videos{
//        display:grid-auto-columns;
//        grid-column-gap:5px;
//        margin-bottom:15px;
//        position: fixed;
//        top: 0;
//        left: 0;
//        bottom: 0;
//        right: 0;
//        margin: 15px;
//        z-index:1500;
//      }
//      #videos > video{
//        border-radius:7px;
//        display:inline-block;
//        background:black;
//        width:80px;
//        height:60px;
//        margin-right:5px;
//        margin-bottom:5px;
//        vertical-align:top;
//        pointer-events:all;
//      }
//      #videos > video:hover{
//        filter: brightness(1.8);
//        cursor:pointer;
//      }
//
//      #chatbar,
//      button#showchat{
//        z-index: 1500;
//        position: fixed;
//        bottom: 20px;
//        left: 20px;
//        width: 48%;
//        background: white;
//        padding: 0px 0px 0px 15px; 
//        border-radius: 30px;
//        max-width: 500px;
//        box-sizing: border-box;
//        box-shadow: 0px 0px 5px 5px #0002;
//      }
//      button#showchat{
//        z-index:1550;
//        color:white;
//        border:0;
//        display:none;
//        height: 44px;
//        background:#07F;
//        font-weight:bold;
//      }
//      #chatbar input{
//        border:none;
//        width:90%;
//        box-sizing:border-box;
//      }
//      #chat{
//        position: absolute;
//        top: 100px;
//        left: 0;
//        right: 0;
//        bottom: 88px;
//        padding: 15px;
//        pointer-events: none;
//        overflow-y:auto;
//      }
//      #chat .msg{
//        background: #fff;
//        display: inline-block;
//        padding: 6px 17px;
//        border-radius: 20px;
//        color: #000c;
//        margin-bottom: 10px;
//        line-height:23px;
//        pointer-events:visible;
//        border: 1px solid #ccc;
//      }
//      #chat .msg.info{
//        background: #333;
//        color: #FFF;
//        font-size: 14px;
//        padding: 0px 16px;
//      }
//      #chat .msg.info a,
//      #chat .msg.info a:visited{
//        color: #aaf;
//        text-decoration: none;
//        transition:0.3s;
//      }
//      #chat .msg.info a:hover,
//      #chat button:hover{
//        filter: brightness(1.8);
//        text-decoration: underline;
//      }
//      #chat button {
//        margin: 0px 15px 10px 0px;
//        background: #07F;
//        color: #FFF;
//        border-radius: 7px;
//        padding: 11px 15px;
//        border: 0;
//        font-weight: bold;
//        box-shadow: 0px 0px 5px 5px #0002;
//        pointer-events:all;
//      }
//      #chat,#chatbar,#chatbar *, #chat *{
//        font-family:monospace;
//        font-size:15px;
//      }
//    </style>
//    <div id="videos" style="pointer-events:none"></div>
//    <div id="chat" aria-live="assertive" aria-relevant></div>
//    <div id="chatfooter"></div>
//    `
//    document.body.appendChild(this.data.$)
//
//    // reactive logic 
//    this.data = new Proxy(this.data, {  
//      html: {
//        chatbar: (data) => data.showChat 
//           ? `<div id="chatbar">
//                  <input id="chatline" type="text" placeholder="${data.placeholderInput}"></input>
//              </div>`
//           : `<button id="showchat" class="btn">show chat</button>`
//      },
//      get(data,k  ){ return data[k] },
//      set(data,k,v){
//        data[k] = v
//        switch( k ){
//
//          case 'cameras':{
//            data.$videos.innerHTML = ''
//            for( let k in data.cameras ) el.appendChild( data.cameras[k] ) )
//            return
//          }
//
//          case 'audios':{
//            data.$videos.innerHTML = ''
//            for( let k in data.cameras ) el.appendChild( data.cameras[k] ) )
//            return
//          }
//
//          case 'showChat':{
//            data.$chatfooter.innerHTML = this.html.chatbar(data)
//            data.$chatline.addEventListener("keydown", this.onChatInput )
//            if( v ){
//              data.$chatfooter.querySelector('#chatline').focus()
//            }
//            return
//          }
//
//        }
//      },
//    })
//
//    // trigger 1st render
//    this.data.showChat = true 
//
//    // setup handles
//    this.data.$videos     = this.data.$.querySelector('#meeting #videos')
//    this.data.$chatfooter = this.data.$.querySelector('#meeting #chatfooter')
//    this.data.$chatline   = this.data.$chatfooter.querySelector('#chatline')
//    this.data.$chat       = this.data.$.querySelector('#meeting #chat')
//    this.data.$chat.add   = this.addMessage 
//
//  },
//
//  addMessage: function(opts){
//      let {str,classes,buttons) = opts 
//      let el = this.data.$chat
//
//      const createMsg = (str) => {
//        let el = document.createElement("div")
//        el.className = "msg"
//        el.innerHTML = this.linkify(str) 
//        return el
//      }
//
//      if( str ){
//        str = str.replace('\n', "<br>")
//                 .replace(/^[a-zA-Z-0-9]+?[:\.]/,'<b>$&</b>')
//        let msg = this.createMsg(str)
//        if( classes ) classes.map( (c) => msg.classList.add(c) )
//        el.appendChild(msg) // send to screen
//        el.innerHTML += '<br>'
//        if( !classes ) this.data.log.push(str)
//      }
//      if( buttons ){
//        for( let i in buttons ){
//          let btn = document.createElement("button")
//          btn.innerText = i 
//          btn.addEventListener('click', () => buttons[i]() )
//          el.appendChild(btn)
//        }
//        el.innerHTML += '<br>'
//      }
//      el.scrollTop = el.scrollHeight; // scroll to bottom
//    }
//  }, 
//
//  onChatInput: function(e){
//    if( e.key !== "Enter" ) return 
//    let $chatline = this.data.$chatline
//    if( !this.data.visitorname ){
//      this.data.visitorname = chatline.value.toLowerCase()
//      this.data.visitorname = this.data.visitorname.replace(/[^a-z]+/g,'-')
//      this.send({message:"note: camera/mic access is totally optional ♥️", classes:["info"], isLocal:false})
//      $chatline.setAttribute("placeholder","chat here")
//    }else{
//      let str = `${this.data.visitorname}: ${$chatline.value.substr(0,65515).trim()}`
//      this.send({message:str})
//    }
//    $chatline.value = ''
//    event.preventDefault();
//    event.target.blur()
//  },
//
//  enableSmallScreen: function(){
//    // on small screens/mobile make chat toggle-able
//    if( window.outerWidth < 1024 ){
//      let show = (state) => () => this.data.showChat = state
//      $('.a-canvas').addEventListener('click',      () => show(false) )
//      $('.a-canvas').addEventListener('touchstart', () => show(false) )
//      $('#showchat').addEventListener('touchstart', () => show(true) )
//      $('#showchat').addEventListener('click',      () => show(true) )
//    }
//  }
//
//  //notifyTeleport: function(url){
//  //  url = url || this.roomname
//  //  url = url.replace(/(#|&)meet/,'')
//  //  let message = `${this.data.visitorname} teleported to ${url}`
//  //  this.send({
//  //    message,
//  //    classes: ["info"]
//  //  })
//  //},
//
//  //linkify: function(t){
//  //  const m = t.match(/(?<=\s|^)[a-zA-Z0-9-:/]+[?\.][a-zA-Z0-9-].+?(?=[.,;:?!-]?(?:\s|$))/g)
//  //  if (!m) return t
//  //  const a = []
//  //  m.forEach(x => {
//  //    const [t1, ...t2] = t.split(x)
//  //    a.push(t1)
//  //    t = t2.join(x)
//  //    let url = (!(x.match(/:\/\//)) ? 'https://' : '') + x
//  //    let attr = `href="${url}" target="_blank"`
//  //    if (isNaN(x) ){
//  //      let url_human    = url.split('/')[2] 
//  //      let isXRFragment = url.match(/\.(glb|gltf|obj|usdz|fbx|col)/)
//  //      if( isXRFragment ){               // detect xr fragments
//  //        isMeeting  = url.match(/(#|&)meet/)
//  //        url_human  = url.replace(/.*[?\?]/,'')   // shorten xr fragment links
//  //                        .replace(/[?\&]meet/,'')
//  //        let onclick = [ `xrf.navigator.to('${url}')` ]
//  //        if( isMeeting ) onclick.push(`$('[meeting]').coms['meeting'].update()`)
//  //        attr = `onclick="${onclick.join(';')}"`
//  //      }
//  //      a.push(`<a ${attr} style="pointer-events:all">${url_human}</a>`)
//  //    }else
//  //      a.push(x)
//  //  })
//  //  a.push(t)
//  //  return a.join('')
//  //}
//
//})
