// this orchestrates multiplayer events from the scene graph

window.network = (opts) => new Proxy({

  connected: false,
  peers: {},
  plugin: {},
  opts,

  start(url){
    console.log("starting network with url "+(url?url:"default"))
  },

  add(peerid,data){
    data = {lastUpdated: new Date().getTime(), id: peerid, ...data }
    this.peers[peerid] = data 
    opts.scene.dispatchEvent({type:'network.peer.add', peer})
  },

  remove(peerid,data){
    delete this.peers[peerid]
    opts.scene.dispatchEvent({type:'network.peer.remove', peer})
  },

  send(opts){

  },

  receive(opts){

  }

},
{ 
  // auto-trigger events on changes 
  get(data,k,receiver){ return data[k] },
  set(data,k,v){
    let from   = data[k]
    data[k] = v
    //switch( k ){
    //  default: network.opts.scene.dispatchEvent({type:`network.${k}.change`, from, to:v})
    //}
  }
})
      
document.addEventListener('$menu:ready', (e) => {
  window.network = network(e.detail) 
  document.dispatchEvent( new CustomEvent("network:ready", e ) )
  $menu.buttons = ([`<a class="btn" aria-label="button" aria-title="connect button" aria-description="start text/audio/video chat" id="meeting" onclick="$connections.show()">🧑‍🤝‍🧑 connect</a><br>`])
                    .concat($menu.buttons)
})
