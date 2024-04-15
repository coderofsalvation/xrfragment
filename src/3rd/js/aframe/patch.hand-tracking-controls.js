AFRAME.components['hand-tracking-controls'].Component.prototype.onModelLoaded = function(onModelLoaded){
  return function(e){
    onModelLoaded.apply(this);
    // re-attach children 
    ([...this.el.children]).map( (c) => {
      if( c.object3D ){
        this.el.object3D.getObjectByName("wrist").add(c.object3D)
      }
    })
  }
}(AFRAME.components['hand-tracking-controls'].Component.prototype.onModelLoaded)
