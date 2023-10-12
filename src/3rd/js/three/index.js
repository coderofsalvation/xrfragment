xrf.frag   = {}
xrf.model  = {}

xrf.init = ((init) => function(opts){
  let scene = new opts.THREE.Group()
  opts.scene.add(scene)
  opts.scene = scene
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
  if( loader.prototype.load.xrf_patched ) return // prevent patching aliased loaders twice
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
  loader.prototype.load.xrf_patched = true
}

xrf.getFile = (url) => url.split("/").pop().replace(/#.*/,'')

xrf.parseModel = function(model,url){
  let file               = xrf.getFile(url)
  model.file             = file
  // eval embedded XR fragments
  model.scene.traverse( (mesh) => xrf.hashbus.pub.mesh(mesh,model) )
  // add animations
  model.clock            = new xrf.THREE.Clock();
  model.mixer            = new xrf.THREE.AnimationMixer(model.scene)
  model.animations.map( (anim) => { 
    anim.action = model.mixer.clipAction( anim )
    //anim.action.setLoop(0)
    anim.action.play() 
  })

  let tmp = new xrf.THREE.Vector3()
  model.render           = function(){
    let time = model.clock.getDelta()
    model.mixer.update( time )

    // update focusline 
    xrf.focusLine.material.color.r  = (1.0 + Math.sin( model.clock.getElapsedTime()*10  ))/2
    xrf.focusLine.material.dashSize = 0.2 + 0.02*Math.sin( model.clock.getElapsedTime()  )
    xrf.focusLine.material.gapSize  = 0.1 + 0.02*Math.sin( model.clock.getElapsedTime() *3  )
    xrf.focusLine.material.opacity  = (0.25 + 0.15*Math.sin( model.clock.getElapsedTime() * 3 )) * xrf.focusLine.opacity;
    if( xrf.focusLine.opacity > 0.0 ) xrf.focusLine.opacity -= time*0.2
    if( xrf.focusLine.opacity < 0.0 ) xrf.focusLine.opacity = 0
  }

}

xrf.getLastModel = ()           => xrf.model.last 

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
  xrf.add( xrf.interactive )
  xrf.layers = 0
}

xrf.parseUrl = (url) => {
  const urlObj = new URL( url.match(/:\/\//) ? url : String(`https://fake.com/${url}`).replace(/\/\//,'/') )
  let   dir  = url.substring(0, url.lastIndexOf('/') + 1)
  const file = urlObj.pathname.substring(urlObj.pathname.lastIndexOf('/') + 1);
  const hash = url.match(/#/) ? url.replace(/.*#/,'') : ''
  const ext  = file.split('.').pop()
  return {urlObj,dir,file,hash,ext}
}

xrf.add = (object) => {
  object.isXRF = true // mark for easy deletion when replacing scene
  xrf.scene.add(object)
}

