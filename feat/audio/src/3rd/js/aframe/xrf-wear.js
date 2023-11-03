window.AFRAME.registerComponent('xrf-wear', {
  schema:{
    el: {type:"selector"}, 
    position: {type:"vec3"}, 
    rotation: {type:"vec3"} 
  }, 
  init: function(){
    $('a-scene').addEventListener('enter-vr', (e) => this.wear(e) )
    $('a-scene').addEventListener('exit-vr',  (e) => this.unwear(e) )
  }, 
  wear: function(){
    if( !this.wearable ){
      let d = this.data
      this.wearable = new THREE.Group()
      this.el.object3D.children.map( (c) => this.wearable.add(c) )
      this.wearable.position.set( d.position.x,  d.position.y,  d.position.z)
      this.wearable.rotation.set( d.rotation.x,  d.rotation.y,  d.rotation.z)
    }
    this.data.el.object3D.add(this.wearable)
  }, 
  unwear: function(){
    this.data.el.remove(this.wearable)
    this.wearable.children.map( (c) => this.el.object3D.add(c) )
    delete this.wearable
  }
})
