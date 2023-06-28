xrf.frag   = {}
xrf.model  = {}

xrf.init = ((init) => function(opts){
  init(opts)
  if( opts.loaders ) Object.values(opts.loaders).map( xrf.patchLoader )

  xrf.patchRenderer(opts.renderer)
  xrf.navigator.init()
  // return xrfragment lib as 'xrf' query functor (like jquery)
  for ( let i in xrf ) xrf.query[i] = xrf[i] 
  return xrf.query
})(xrf.init)

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
                (model) => { 
                  onLoad(model); 
                  xrf.parseModel(model,url) 
                },
                onProgress,
                onError)
  })(loader.prototype.load)
}

xrf.getFile = (url) => url.split("/").pop().replace(/#.*/,'')

xrf.parseModel = function(model,url){
  let file               = xrf.getFile(url)
  model.file             = file
  // eval embedded XR fragments
  model.scene.traverse( (mesh) => xrf.eval.mesh(mesh,model) )
  // add animations
  model.clock            = new xrf.THREE.Clock();
  model.mixer            = new xrf.THREE.AnimationMixer(model.scene)
  model.animations.map( (anim) => model.mixer.clipAction( anim ).play() )
  model.render           = function(){
    model.mixer.update( model.clock.getDelta() )
    xrf.navigator.material.selection.color.r = (1.0 + Math.sin( model.clock.getElapsedTime() * 10 ))/2
  }
}

xrf.getLastModel = ()           => xrf.model.last 

xrf.eval = function( url, model, flags ){  // evaluate fragments in url
  let notice = false
  model = model || xrf.model
  let { THREE, camera } = xrf
  let frag = xrf.URI.parse( url, flags || xrf.XRF.NAVIGATOR )
  let opts = {frag, mesh:xrf.camera, model, camera: xrf.camera, scene: xrf.scene, renderer: xrf.renderer, THREE: xrf.THREE }
  xrf.emit('eval',opts)
  .then( () => {
    for ( let k in frag ){
      xrf.eval.fragment(k,opts) 
    }
  })
}

xrf.eval.mesh     = (mesh,model) => { // evaluate embedded fragments (metadata) inside mesh of model 
  if( mesh.userData ){
    let frag = {}
    for( let k in mesh.userData ) xrf.Parser.parse( k, mesh.userData[k], frag )
    for( let k in frag ){
      let opts = {frag, mesh, model, camera: xrf.camera, scene: xrf.scene, renderer: xrf.renderer, THREE: xrf.THREE }
      mesh.userData.XRF = frag // allow fragment impl to access XRF obj already
      xrf.emit('eval',opts)
      .then( () => xrf.eval.fragment(k,opts) )
    }
  }
}

xrf.eval.fragment = (k, opts ) => { // evaluate one fragment
  // call native function (xrf/env.js e.g.), or pass it to user decorator
  let func = xrf.frag[k] || function(){} 
  if(  xrf[k] ) xrf[k]( func, opts.frag[k], opts)
  else                  func( opts.frag[k], opts)
}

xrf.reset = () => {
  const disposeObject = (obj) => {
    if (obj.children.length > 0) obj.children.forEach((child) => disposeObject(child));
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
      if (obj.material.map) obj.material.map.dispose();
      obj.material.dispose();
    }
    obj.clear()
    obj.removeFromParent() 
    return true
  };
  let nodes = []
  xrf.scene.traverse( (child) => child.isXRF ? nodes.push(child) : false )
  nodes.map( disposeObject ) // leave non-XRF objects intact
  xrf.interactive = xrf.InteractiveGroup( xrf.THREE, xrf.renderer, xrf.camera)
  xrf.add( xrf.interactive)
}

xrf.parseUrl = (url) => {
  let   dir = url.substring(0, url.lastIndexOf('/') + 1)
  // safety-net/fallback for relative and protocol-agnostic urls
  if( !url.match(/:\/\//) ) url = String(`https://fake.com/${url}`) //.replace(/\/\//,'/') 
  const urlObj = new URL( url )
  const file = urlObj.pathname.substring(urlObj.pathname.lastIndexOf('/') + 1);
  const hash = url.match(/#/) ? url.replace(/.*#/,'') : ''
  const ext  = file.split('.').pop()
  return {urlObj,dir,file,hash,ext}
}

xrf.add = (object) => {
  object.isXRF = true // mark for easy deletion when replacing scene
  xrf.scene.add(object)
}

