xrf.frag.pos = function(v, opts){
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts
  
  if( frag.q ){ // only operate on queried object(s)

    // apply roundrobin (if any)
    if( v.args ) v = v.args[ xrf.roundrobin(v,model) ]

    frag.q.getObjects().map( (o) => {
      // if object has no parent (name == 'Scene') use absolute positioning, otherwise relative to parent
      o.position.x = o.parent.name == 'Scene' ? v.x : o.positionOriginal.x + v.x
      o.position.y = o.parent.name == 'Scene' ? v.z : o.positionOriginal.y + v.z
      o.position.z = o.parent.name == 'Scene' ? v.y : o.positionOriginal.z + v.y
    })
  }else{
    camera.position.x = v.x
    camera.position.y = v.y
    camera.position.z = v.z
  }

}
