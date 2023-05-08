xrfragment.xrf  = {}
xrfragment.model = {}

xrfragment.init = function(opts){
  opts = opts || {}
  let XRF = function(){
    alert("queries are not implemented (yet)")
  }
  for ( let i in opts           ) XRF[i] = xrfragment[i] = opts[i]
  for ( let i in xrfragment     ) XRF[i] = xrfragment[i]
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

xrfragment.getFile = (url) => url.split("/").pop().replace(/#.*/,'')

xrfragment.parseModel = function(model,url){
  let file               = xrfragment.getFile(url)
  model.file             = file
  model.render           = function(){}
  xrfragment.model[file] = model
  console.log("scanning "+file)

  model.scene.traverse( (mesh) => {
    console.log(mesh.name)
    if( mesh.userData ){
      let frag = {}
      for( let k in mesh.userData ){
        xrfragment.Parser.parse( k, mesh.userData[k], frag )
        // call native function (xrf/env.js e.g.), or pass it to user decorator
        let func = xrfragment.xrf[k] || function(){} 
        let opts = {mesh, model, camera: xrfragment.camera, scene: xrfragment.scene, renderer: xrfragment.renderer, THREE: xrfragment.THREE }
        if(  xrfragment[k] ) xrfragment[k]( func, frag[k], opts)
        else                                func( frag[k], opts)
      }
    }
  })
}
  
xrfragment.getLastModel = () => Object.values(xrfragment.model)[ Object.values(xrfragment.model).length-1 ]

xrfragment.eval = function( url, model ){
  let notice = false
  let { THREE, camera } = xrfragment
  let frag = xrfragment.URI.parse( url, XRF.NAVIGATOR )

  for ( let i in frag  ) {
    if( !String(i).match(/(pos|rot)/) ) notice = true
    if( i == "pos" ){
      camera.position.x = frag.pos.x
      camera.position.y = frag.pos.y
      camera.position.z = frag.pos.z
    }
    if( i == "rot" ){
      camera.rotation.x = THREE.MathUtils.degToRad( frag.pos.x )
      camera.rotation.y = THREE.MathUtils.degToRad( frag.pos.y )
      camera.rotation.z = THREE.MathUtils.degToRad( frag.pos.z )
    }
  }
  if( notice ) alert("only 'pos' and 'rot' XRF.NAVIGATOR-flagged XR fragments are supported (for now)")
  console.dir({url,model,frag})
}
