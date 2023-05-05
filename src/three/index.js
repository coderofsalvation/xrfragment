xrfragment.xrf  = {}
xrfragment.model = {}

xrfragment.init = function(opts){
  opts = opts || {}
  let XRF = function(){
    alert("ja")
  }
  for ( let i in opts           ) XRF[i] = xrfragment[i] = opts[i]
  for ( let i in xrfragment.XRF ) XRF[i] = xrfragment.XRF[i] // shortcuts to constants (NAVIGATOR e.g.)
  xrfragment.Parser.debug = xrfragment.debug 
  if( opts.loaders ) opts.loaders.map( xrfragment.patchLoader )
  return XRF
}

xrfragment.patchLoader = function(loader){
  loader.prototype.load = ((load) => function(url, onLoad, onProgress, onError){
    load.call(  this,
                url,
                (model) => { onLoad(model); xrfragment.parseModel(model,url) },
                onProgress,
                onError)
  })(loader.prototype.load)
}

xrfragment.parseModel = function(model,url){
  let file = url.split("/").pop().replace(/#.*/,'')
  xrfragment.model[file] = model
  model.scene.traverse( (mesh) => {
    if( mesh.userData ){
      let frag = {}
      for( let k in mesh.userData ){
        xrfragment.Parser.parse( k, mesh.userData[k], frag )
        // call native function (xrf/env.js e.g.), or pass it to user decorator
        let func = xrfragment.xrf[k] || function(){} 
        let opts = {mesh, model, camera:xrfragment.camera, scene: xrfragment.scene, renderer: xrfragment.renderer, THREE: xrfragment.THREE }
        if(  xrfragment[k] ) xrfragment[k]( func, frag[k], opts)
        else                                func( frag[k], opts)
      }
    }
  })
}
  
xrfragment.getLastModel = () => Object.values(xrfragment.model)[ Object.values(xrfragment.model).length-1 ]

xrfragment.eval = function( url, model ){
  console.dir({url,model})
}
