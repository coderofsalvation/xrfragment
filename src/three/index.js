xrfragment.three = {}

xrfragment.init = function(opts){
  opts = opts || {}
  for ( let i in opts           ) xrfragment[i] = opts[i]
  for ( let i in xrfragment.XRF ) xrfragment[i] = xrfragment.XRF[i] // shortcuts to constants (BROWSER_OVERRIDE e.g.)
  xrfragment.Parser.debug = xrfragment.debug 
  if( opts.loaders ) opts.loaders.map( xrfragment.patchLoader )
  return xrfragment
}

xrfragment.patchLoader = function(loader){
  loader.prototype.load = ((load) => function(url, onLoad, onProgress, onError){
    load.call(  this,
                url,
                (model) => { onLoad(model); xrfragment.parseModel(model) },
                onProgress,
                onError)
  })(loader.prototype.load)
}

xrfragment.parseModel = function(model){
  model.scene.traverse( (mesh) => {
    if( mesh.userData ){
      let frag = {}
      for( let k in mesh.userData ){
        xrfragment.Parser.parse( k, mesh.userData[k], frag )
        // call native function (xrf/env.js e.g.), or pass it to user decorator
        let func = xrfragment.three[k] || function(){} 
        let opts = {mesh, model, camera:xrfragment.camera, scene: xrfragment.scene, renderer: xrfragment.renderer, THREE: xrfragment.THREE }
        if(  xrfragment[k] ) xrfragment[k]( func, frag[k], opts)
        else                                func( frag[k], opts)
      }
    }
  })
}
