// this orchestrates multiplayer events from the scene graph

window.network = (opts) => new Proxy({

  connected: false,
  pos: '',
  posName: '',
  meetinglink: "",
  peers: {},
  plugin: {},
  opts,

  init(){
    document.addEventListener('network.disconnect', () => this.connected = false )
    document.addEventListener('network.connected',  () => this.connected = true  )
    setTimeout( () => window.frontend.emit('network.init'), 100 )
    return this
  },

  connect(opts){
    window.frontend.emit(`network.${this.connected?'disconnect':'connect'}`,opts)
  },

  add(peerid,data){
    data = {lastUpdated: new Date().getTime(), id: peerid, ...data }
    this.peers[peerid] = data 
    window.frontend.emit(`network.peer.add`,{peer})
  },

  remove(peerid,data){
    delete this.peers[peerid]
    window.frontend.emit(`network.peer.remove`,{peer})
  },

  send(opts){
    window.frontend.emit('network.send',opts)
  },

  receive(opts){

  },

  getMeetingFromUrl(url){
    let hash = url.replace(/.*#/,'')
    let parts = hash.split("&")
    let meeting = ''
    parts.map( (p) => {
      if( p.split("=")[0] == 'meet' ) meeting = p.split("=")[1]
    })
    return meeting
  },

  randomRoom(){
    var names = []
    let add = (s) => s.length < 6 && !s.match(/[0-9$]/) && !s.match(/_/) ? names.push(s) : false
    for ( var i in window             ) add(i)
    for ( var i in Object.prototype   ) add(i)
    for ( var i in Function.prototype ) add(i)
    for ( var i in Array.prototype    ) add(i)
    for ( var i in String.prototype   ) add(i) 
    var a = names[Math.floor(Math.random() * names.length)];
    var b = names[Math.floor(Math.random() * names.length)];
    var c = names[Math.floor(Math.random() * names.length)];
    return String(`${a}-${b}-${c}`).toLowerCase()
  }

},
{ 
  // auto-trigger events on changes 
  get(data,k,receiver){ return data[k] },
  set(data,k,v){
    let from   = data[k]
    data[k] = v
  }
})
      
document.addEventListener('frontend:ready', (e) => {
  window.network = network(e.detail).init()
  document.dispatchEvent( new CustomEvent("network:ready", e ) )
})
