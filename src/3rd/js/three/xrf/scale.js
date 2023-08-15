xrf.frag.scale = function(v, opts){
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts
  
  // apply roundrobin (if any)
  if( v.args ) v = v.args[ xrf.roundrobin(v,model) ]

  if( frag.q ){ // only operate on queried object(s)
    frag.q.getObjects().map( (o) => {
      o.scale.x = v.x
      o.scale.y = v.y
      o.scale.z = v.z
    })
  }

}
