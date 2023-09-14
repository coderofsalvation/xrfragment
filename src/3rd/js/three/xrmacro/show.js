xrf.addEventListener('eval', (opts) => {
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts
  if( frag.show && frag.q ){
    let show = frag.show

    // apply roundrobin (if any)
    if( show.args ) v = show.args[ xrf.roundrobin(show,model) ]
    else v = show.int

    // let wait for the queried objects (as we're inside promise which traverses the graph)
    setTimeout( (v) => {
      frag.q.getObjects().map( (o) => {
        o.visible = v.int == 1;
      })
    }, 20, v)
  }
})
