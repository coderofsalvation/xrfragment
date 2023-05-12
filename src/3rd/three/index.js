let xrf = xrfragment
xrf.frag   = {}
xrf.model = {}

xrf.init = function(opts){
  opts = opts || {}
  let XRF = function(){
    alert("queries are not implemented (yet)")
  }
  for ( let i in opts    ) xrf[i] = opts[i]
  for ( let i in xrf.XRF ) xrf.XRF[i] // shortcuts to constants (NAVIGATOR e.g.)
  xrf.Parser.debug = xrf.debug 
  if( opts.loaders ) Object.values(opts.loaders).map( xrf.patchLoader )
  xrf.patchRenderer(opts.renderer)
  xrf.navigate.init()
  return xrf
}

xrf.patchRenderer = function(renderer){
  renderer.xr.addEventListener( 'sessionstart', () => xrf.baseReferenceSpace = renderer.xr.getReferenceSpace() );
  renderer.xr.enabled = true;
  renderer.render = ((render) => function(scene,camera){
    if( xrf.model && xrf.model.render ) 
      xrf.model.render(scene,camera)
    render(scene,camera)
  })(renderer.render.bind(renderer))
}

xrf.patchLoader = function(loader){
  loader.prototype.load = ((load) => function(url, onLoad, onProgress, onError){
    load.call(  this,
                url,
                (model) => { onLoad(model); xrf.parseModel(model,url) },
                onProgress,
                onError)
  })(loader.prototype.load)
}

xrf.getFile = (url) => url.split("/").pop().replace(/#.*/,'')

xrf.parseModel = function(model,url){
  let file               = xrf.getFile(url)
  model.file             = file
  model.render           = function(){}
  model.interactive        = xrf.InteractiveGroup( xrf.THREE, xrf.renderer, xrf.camera)
  model.scene.add(model.interactive)

  console.log("scanning "+file)

  model.scene.traverse( (mesh) => {
    console.log("◎ "+ (mesh.name||`THREE.${mesh.constructor.name}`))
    xrf.eval.mesh(mesh,model)
  })
}

xrf.getLastModel = ()           => xrf.model.last 

xrf.eval = function( url, model ){
  let notice = false
  model = model || xrf.model
  let { THREE, camera } = xrf
  let frag = xrf.URI.parse( url, xrf.XRF.NAVIGATOR )
  let meshes = frag.q ? [] : [camera]

  for ( let i in meshes ) {
    for ( let k in frag ){
      let mesh = meshes[i]
      if( !String(k).match(/(pos|rot)/) ) notice = true
      let opts = {frag, mesh, model, camera: xrf.camera, scene: xrf.scene, renderer: xrf.renderer, THREE: xrf.THREE }
      xrf.eval.fragment(k,opts)
    }
  }
  if( notice ) alert("only 'pos' and 'rot' XRF.NAVIGATOR-flagged XR fragments are supported (for now)")
}

xrf.eval.mesh     = (mesh,model) => {
  if( mesh.userData ){
    let frag = {}
    for( let k in mesh.userData ) xrf.Parser.parse( k, mesh.userData[k], frag )
    for( let k in frag ){
      let opts = {frag, mesh, model, camera: xrf.camera, scene: xrf.scene, renderer: xrf.renderer, THREE: xrf.THREE }
      xrf.eval.fragment(k,opts)
    }
  }
}

xrf.eval.fragment = (k, opts ) => {
  // call native function (xrf/env.js e.g.), or pass it to user decorator
  let func = xrf.frag[k] || function(){} 
  if(  xrf[k] ) xrf[k]( func, opts.frag[k], opts)
  else                  func( opts.frag[k], opts)
}

xrf.reset = () => {
  if( !xrf.model.scene ) return 
  xrf.scene.remove( xrf.model.scene )
  xrf.model.scene.traverse( function(node){
    if( node instanceof THREE.Mesh ){
      node.geometry.dispose()
      node.material.dispose()
    }
  })
}

xrf.navigate = {}

xrf.navigate.to = (url) => {
  return new Promise( (resolve,reject) => {
    console.log("xrfragment: navigating to "+url)
    if( xrf.model && xrf.model.scene ) xrf.model.scene.visible = false
    const urlObj = new URL( url.match(/:\/\//) ? url : String(`https://fake.com/${url}`).replace(/\/\//,'/') )
    let   dir  = url.substring(0, url.lastIndexOf('/') + 1)
    const file = urlObj.pathname.substring(urlObj.pathname.lastIndexOf('/') + 1);
    const ext  = file.split('.').pop()
    const Loader = xrf.loaders[ext]
    if( !Loader ) throw 'xrfragment: no loader passed to xrfragment for extension .'+ext 
    // force relative path 
    if( dir ) dir = dir[0] == '.' ? dir : `.${dir}`
    const loader = new Loader().setPath( dir )
    loader.load( file, function(model){
      xrf.scene.add( model.scene )
      xrf.reset()
      xrf.model = model 
      xrf.navigate.commit( file )
      resolve(model)
    })
  })
}

xrf.navigate.init = () => {
  if( xrf.navigate.init.inited ) return
  window.addEventListener('popstate', function (event){
    console.dir(event)
    xrf.navigate.to( document.location.search.substr(1) + document.location.hash )
  })
  xrf.navigate.init.inited = true
}

xrf.navigate.commit = (file) => {
  window.history.pushState({},null, document.location.pathname + `?${file}${document.location.hash}` )
}
