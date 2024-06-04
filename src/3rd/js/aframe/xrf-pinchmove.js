// poor man's way to move forward using hand gesture pinch

window.AFRAME.registerComponent('xrf-pinchmove', {
  schema:{
    rig: {type: "selector"}
  }, 
  init: function(){

    this.el.addEventListener("pinchended", () => {
      // get the cameras world direction
      let direction = new THREE.Vector3()
      this.el.sceneEl.camera.getWorldDirection(direction);
      // multiply the direction by a "speed" factor
      direction.multiplyScalar(0.4)
      // get the current position
      var pos = xrf.camera.position  
      //player.getAttribute("position")
      // add the direction vector
      pos.x += direction.x 
      pos.z += direction.z
      // set the new position
      //this.data.rig.setAttribute("position", pos);
      // !!! NOTE - it would be more efficient to do the
      // position change on the players THREE.Object:
      // `player.object3D.position.add(direction)`
      // but it would break "getAttribute("position")
    })
  }, 
})
