xrf.frag.pos = function(v, opts){
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts
  console.log("   └ setting camera position to "+v.string)

  if( !frag.q ){ 
    camera.position.x = v.x
    camera.position.y = v.y
    camera.position.z = v.z
  }
}
