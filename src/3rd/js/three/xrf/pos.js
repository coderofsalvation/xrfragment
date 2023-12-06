xrf.frag.pos = function(v, opts){
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts


  // spec: indirect coordinate using objectname: https://xrfragment.org/#navigating%203D
  if( v.x == undefined ){
    let obj = scene.getObjectByName(v.string)
    if( !obj ) return 
    let pos = obj.position.clone()
    obj.getWorldPosition(pos)
    camera.position.copy(pos)
  }else{ 
    // spec: direct coordinate: https://xrfragment.org/#navigating%203D
    camera.position.x = v.x
    camera.position.y = v.y
    camera.position.z = v.z
  }
}
