// SPDX-License-Identifier: MPL-2.0        
// Copyright (c) 2023 Leon van Kammen/NLNET 

var xrf = {}

xrf.init = function(opts){
  opts      = opts || {}

  xrf.debug = document.location.hostname.match(/^(localhost|[0-9]\.[0-9])/) || document.location.port == '8080' ? 0 : false
  if( document.location.hash.match(/debug=([0-9])/) ){
    xrf.debug = parseInt( ( document.location.hash.match(/debug=([0-9])/) || [0,'0'] )[1] )
  }
  if( xrf.debug === false ) console.log("add #debug=[0-9] to URL to see XR Fragment debuglog")

  xrf.Parser.debug = xrf.debug 
  xrf.detectCameraRig(opts)
  for ( let i in opts ) xrf[i] = opts[i]
  xrf.emit('init',opts)
  return xrf
}

xrf.query = function(){
  // framework implementations can override this function, see src/3rd/js/three/index.sj 
  alert("queries are not implemented (yet) for this particular framework")
}

xrf.detectCameraRig = function(opts){
  if( opts.camera ){ // detect rig (if any)
    let getCam  = ((cam) => () => cam)(opts.camera)
    let offsetY = 0 
    while( opts.camera.parent.type != "Scene" ){
      offsetY += opts.camera.position.y
      opts.camera = opts.camera.parent
      opts.camera.getCam = getCam
      opts.camera.updateProjectionMatrix = () => opts.camera.getCam().updateProjectionMatrix()
    }
    opts.camera.offsetY = offsetY
  }
}

xrf.hasTag = (tag,tags) => String(tags).match( new RegExp(`(^| )${tag}( |$)`,`g`) )

// map library functions to xrf
for ( let i in xrfragment ) xrf[i] = xrfragment[i] 
