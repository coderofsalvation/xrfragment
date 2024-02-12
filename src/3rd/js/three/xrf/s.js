xrf.frag.s = function(v, opts){
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts

  // handle object media players
  if( mesh && mesh.media ){
    for( let i in mesh.media ) mesh.media[i].set("s",v)
    return
  }

  // otherwise handle global 3D animations
  xrf.mixers.map ( (mixer) => {
    mixer.s = v
    
    // update speed
    mixer.timeScale     = v.x || 1.0 
    mixer.loop.speed    = v.x || 1.0
    mixer.loop.speedAbs = Math.abs( v.x )

  })

}
