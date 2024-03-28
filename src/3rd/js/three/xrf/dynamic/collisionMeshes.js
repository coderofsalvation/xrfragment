// switch camera when multiple cameras for url #mycameraname

xrf.addEventListener('navigateLoaded', (opts) => {
  let els       = xrf.getCollisionMeshes()
  let invisible = false
  els.map( (mesh) => {
    if( !invisible ){
      invisible = mesh.material.clone()
      invisible.visible = false
    }
    mesh.material = invisible 
    xrf.emit('collisionMesh', mesh )
  })
})
