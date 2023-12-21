// this orchestrates multiplayer events from the scene graph

window.meeting = (THREE, scene) => new Proxy({
 
  status: 'offline',
  peers: {},


  add(peerid,data){
    data = {lastUpdated: new Date().getTime(), id: peerid, ...data }
    this.peers[peerid] = data 
    scene.dispatchEvent({type:'meeting.peer.add', peer})
  },

  remove(peerid,data){
    delete this.peers[peerid]
    scene.dispatchEvent({type:'meeting.peer.remove', peer})
  },

  send(opts){

  },

  receive(opts){

  }
},
{ 
  // auto-trigger events on changes 
  get(meeting,k,receiver){ return meeting[k] },
  set(meeting,k,v){
    let from   = meeting[k]
    meeting[k] = v
    switch( k ){
      default: scene.dispatchEvent({type:`meeting.${k}.change`, from, to:v})
    }
  }
})
