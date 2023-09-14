xrf.addEventListener('eval', (opts) => {
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts
  if( frag.scale && frag.q ){
    // apply roundrobin (if any)
    if( v.args ) v = v.args[ xrf.roundrobin(v,model) ]

    frag.q.getObjects().map( (o) => {
      o.scale.x = v.x
      o.scale.y = v.y
      o.scale.z = v.z
    })
  }
})
