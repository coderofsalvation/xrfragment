xrfragment.three = {}

xrfragment.init = function(opts){
  opts = opts || {}
  for ( let i in opts ) xrfragment[i] = opts[i]
  xrfragment.Parser.debug = xrfragment.debug 
  if( opts.loaders ) opts.loaders.map( xrfragment.patchLoader )
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
        if(  xrfragment[k] ) xrfragment[k]( func, frag[k], mesh, model, xrfragment.scene, xrfragment.renderer, xrfragment.THREE )
        else                                func( frag[k], mesh, model, xrfragment.scene, xrfragment.renderer, xrfragment.THREE )
      }
    }
  })
}
