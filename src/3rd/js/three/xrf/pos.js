xrf.frag.pos = function(v, opts){
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts

  let pos = v

  // spec: indirect coordinate using objectname: https://xrfragment.org/#navigating%203D
  if( pos.x == undefined ){
    let obj = scene.getObjectByName(v.string)
    if( !obj ) return 
    pos = obj.position.clone()
    obj.getWorldPosition(pos)
    camera.position.copy(pos)
  }else{ 
    // spec: direct coordinate: https://xrfragment.org/#navigating%203D
    camera.position.x = pos.x
    camera.position.y = pos.y
    camera.position.z = pos.z
  }

  xrf.frag.pos.last = pos // remember

  camera.updateMatrixWorld()
}
