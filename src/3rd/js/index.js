// SPDX-License-Identifier: MPL-2.0        
// Copyright (c) 2023 Leon van Kammen/NLNET 

var xrf = {}

xrf.init = function(opts){
  opts      = opts || {}

  xrf.debug = document.location.hostname.match(/^(localhost|[0-9])/) ? 0 : false
  if( !xrf.debug ){
    console.log("add #debug=[0-9] to URL to see XR Fragment debuglog")
    xrf.debug = parseInt( ( document.location.hash.match(/debug=([0-9])/) || [0,'0'] )[1] )
  }
  if( xrf.debug != undefined ) xrf.stats()

  xrf.Parser.debug = xrf.debug 
  xrf.detectCameraRig(opts)
  for ( let i in opts    ) xrf[i] = opts[i]
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

xrf.roundrobin = (frag, store) => {
  if( !frag.args || frag.args.length == 0 ) return 0
  if( !store.rr                 ) store.rr = {}
  let label = frag.fragment
  if( store.rr[label] ) return store.rr[label].next()
  store.rr[label] = frag.args
  store.rr[label].next  = () => {
    store.rr[label].index = (store.rr[label].index + 1) % store.rr[label].length 
    return store.rr[label].index
  }
  return store.rr[label].index = 0
}

xrf.stats = () => {
  // bookmarklet from https://github.com/zlgenuine/threejs_stats
  (function(){
    for( let i = 0; i < 4; i++ ){
      var script=document.createElement('script');script.onload=function(){var stats=new Stats();stats.showPanel( i ); 
        stats.dom.style.marginTop = `${i*48}px`;  document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';document.head.appendChild(script);
    }
  })()
}

xrf.hasTag = (tag,tags) => String(tags).match( new RegExp(`(^| )${tag}( |$)`,`g`) )

// map library functions to xrf
for ( let i in xrfragment ) xrf[i] = xrfragment[i] 
