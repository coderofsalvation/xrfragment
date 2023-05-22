xrf.frag.pos = function(v, opts){
  //if( renderer.xr.isPresenting ) return // too far away 
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts
  console.log("   └ setting camera position to "+v.string)

  if( !frag.q ){ 

    if( true ){//!renderer.xr.isPresenting ){
      console.dir(camera)
      camera.position.x = v.x
      camera.position.y = v.y
      camera.position.z = v.z
    }
      /*
    else{ // XR
      let cameraWorldPosition = new THREE.Vector3()
      camera.object3D.getWorldPosition(this.cameraWorldPosition)
      let newRigWorldPosition = new THREE.Vector3(v.x,v.y,x.z)

      // Finally update the cameras position
      let newRigLocalPosition.copy(this.newRigWorldPosition)
      if (camera.object3D.parent) {
        camera.object3D.parent.worldToLocal(newRigLocalPosition)
      }
      camera.setAttribute('position', newRigLocalPosition)

      // Also take the headset/camera rotation itself into account
      if (this.data.rotateOnTeleport) {
        this.teleportOcamerainQuaternion
          .setFromEuler(new THREE.Euler(0, this.teleportOcamerain.object3D.rotation.y, 0))
        this.teleportOcamerainQuaternion.invert()
        this.teleportOcamerainQuaternion.multiply(this.hitEntityQuaternion)
        // Rotate the camera based on calculated teleport ocamerain rotation
        this.cameraRig.object3D.setRotationFromQuaternion(this.teleportOcamerainQuaternion)
      }

      console.log("XR")
      const offsetPosition = { x: - v.x, y: - v.y, z: - v.z, w: 1 };
      const offsetRotation = new THREE.Quaternion();
      const transform = new XRRigidTransform( offsetPosition, offsetRotation );
      const teleportSpaceOffset = xrf.baseReferenceSpace.getOffsetReferenceSpace( transform );
      renderer.xr.setReferenceSpace( teleportSpaceOffset );
    }
    */

  }
}
