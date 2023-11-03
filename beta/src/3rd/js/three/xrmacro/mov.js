xrf.addEventListener('mov', (opts) => {
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts
  if( frag.mov && frag.q ){

    // let wait for the queried objects (as we're inside promise which traverses the graph)
    setTimeout( (v) => {
      frag.q.getObjects().map( (o) => {
        o.position.add( new THREE.Vector3( v.x, v.y, v.z ) )
      })
    },10, frag.mov )
  }
})
