xrf.frag.mov = function(v, opts){
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts

  if( frag.q ){ // only operate on queried object(s)
    frag.q.getObjects().map( (o) => {
      o.position.add( new THREE.Vector3( v.x, v.y, v.z ) )
    })
  }

}
