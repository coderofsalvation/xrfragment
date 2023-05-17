let xrf = xrfragment
xrf.frag   = {}
xrf.model  = {}

xrf.init = function(opts){
  opts = opts || {}
  let XRF = function(){
    alert("queries are not implemented (yet)")
  }
  for ( let i in opts    ) xrf[i] = opts[i]
  for ( let i in xrf.XRF ) xrf.XRF[i] // shortcuts to constants (NAVIGATOR e.g.)
  xrf.Parser.debug = xrf.debug 
  if( opts.loaders ) Object.values(opts.loaders).map( xrf.patchLoader )

  xrf.interactive = xrf.InteractiveGroup( opts.THREE, opts.renderer, opts.camera)
  xrf.scene.add( xrf.interactive)
  xrf.patchRenderer(opts.renderer)
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
  model.scene.traverse( (mesh) => xrf.eval.mesh(mesh,model) )
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
      mesh.userData.XRF = frag // allow fragment impl to access XRF obj already
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
  console.log("xrf.reset()")

  const disposeObject = (obj) => {
    if (obj.children.length > 0) obj.children.forEach((child) => disposeObject(child));
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
      if (obj.material.map) obj.material.map.dispose();
      obj.material.dispose();
    }
    return true
  };

  for ( let i in xrf.scene.children  ) {
    const child = xrf.scene.children[i];
    if( child.xrf ){ // dont affect user objects
      disposeObject(child);
      xrf.scene.remove(child);
    }
  }
  // remove interactive xrf objs like href-portals
  xrf.interactive.traverse( (n) => { 
    if( disposeObject(n) ) xrf.interactive.remove(n)
  })
}

xrf.parseUrl = (url) => {
  const urlObj = new URL( url.match(/:\/\//) ? url : String(`https://fake.com/${url}`).replace(/\/\//,'/') )
  let   dir  = url.substring(0, url.lastIndexOf('/') + 1)
  const file = urlObj.pathname.substring(urlObj.pathname.lastIndexOf('/') + 1);
  const hash = url.match(/#/) ? url.replace(/.*#/,'') : ''
  const ext  = file.split('.').pop()
  return {urlObj,dir,file,hash,ext}
}
