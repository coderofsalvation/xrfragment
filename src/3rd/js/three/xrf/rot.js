xrf.frag.rot = function(v, opts){
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts
  
  // apply roundrobin (if any)
  if( v.args ) v = v.args[ xrf.roundrobin(v,model) ]

  if( frag.q ){ // only operate on queried object(s)
    frag.q.getObjects().map( (o) => {
      o.rotation.set( 
        v.x * Math.PI / 180,
        v.y * Math.PI / 180,
        v.z * Math.PI / 180
      )
    })
  }else{
    console.log("   └ setting camera rotation to "+v.string)
    camera.rotation.set( 
      v.x * Math.PI / 180,
      v.y * Math.PI / 180,
      v.z * Math.PI / 180
    )
    camera.updateMatrixWorld()
  }
}
