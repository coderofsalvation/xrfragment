// this orchestrates multiplayer events from the scene graph

window.meeting = (THREE, scene) => ({
  peer:{
    peers: [],
    add(peer){
      let defaults = {lastUpdated: new Date().getTime() }
      peer = { ...defaults,...peer}
      this.peers.push(peer)
      scene.dispatchEvent({type:'meeting.peer.add', peer})
    },
    remove(peer){
      scene.dispatchEvent({type:'meeting.peer.remove', peer})
    },
    send(opts){

    },
    receive(opts){

    }
  }
})
