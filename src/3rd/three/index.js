xrfragment.xrf  = {}
xrfragment.model = {}

xrfragment.init = function(opts){
  opts = opts || {}
  let XRF = function(){
    alert("queries are not implemented (yet)")
  }
  for ( let i in opts           ) xrfragment[i] = opts[i]
  for ( let i in xrfragment.XRF ) xrfragment.XRF[i] // shortcuts to constants (NAVIGATOR e.g.)
  xrfragment.Parser.debug = xrfragment.debug 
  if( opts.loaders ) opts.loaders.map( xrfragment.patchLoader )
  xrfragment.patchRenderer(opts.renderer)
  return xrfragment
}

xrfragment.patchRenderer = function(renderer){
  renderer.render = ((render) => function(scene,camera){
    if( xrfragment.getLastModel() && xrfragment.getLastModel().render ) 
      xrfragment.getLastModel().render(scene,camera)
    render(scene,camera)
  })(renderer.render.bind(renderer))
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
    console.log("◎ "+mesh.name)
    if( mesh.userData ){
      let frag = {}
      for( let k in mesh.userData ) xrfragment.Parser.parse( k, mesh.userData[k], frag )
      for( let k in frag ){
        let opts = {frag, mesh, model, camera: xrfragment.camera, scene: xrfragment.scene, renderer: xrfragment.renderer, THREE: xrfragment.THREE }
        xrfragment.evalFragment(k,opts)
      }
    }
  })
}

xrfragment.evalFragment = (k, opts ) => {
  // call native function (xrf/env.js e.g.), or pass it to user decorator
  let func = xrfragment.xrf[k] || function(){} 
  if(  xrfragment[k] ) xrfragment[k]( func, opts.frag[k], opts)
  else                                func( opts.frag[k], opts)
}
  
xrfragment.getLastModel = () => Object.values(xrfragment.model)[ Object.values(xrfragment.model).length-1 ]

xrfragment.eval = function( url, model ){
  let notice = false
  model = model || xrfragment.getLastModel()
  let { THREE, camera } = xrfragment
  let frag = xrfragment.URI.parse( url, xrfragment.XRF.NAVIGATOR )
  let meshes = frag.q ? [] : [camera]

  for ( let i in meshes ) {
    for ( let k in frag ){
      let mesh = meshes[i]
      if( !String(k).match(/(pos|rot)/) ) notice = true
      let opts = {frag, mesh, model, camera: xrfragment.camera, scene: xrfragment.scene, renderer: xrfragment.renderer, THREE: xrfragment.THREE }
      xrfragment.evalFragment(k,opts)
    }
  }
  if( notice ) alert("only 'pos' and 'rot' XRF.NAVIGATOR-flagged XR fragments are supported (for now)")
}
