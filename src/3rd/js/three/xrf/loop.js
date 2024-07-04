// SPDX-FileCopyrightText: 2023 Leon van Kammen/NLNET
//
// SPDX-License-Identifier: MPL-2.0

xrf.frag.loop = function(v, opts){
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts

  // handle object media players
  if( mesh && mesh.media ){
    for( let i in mesh.media ) mesh.media[i].set("loop",v)
    return
  }

  // otherwise handle global 3D animations
  xrf.mixers.map ( (mixer) => {
    // update loop
    mixer.loop.enabled  = v.loop 

  })

}
