// SPDX-FileCopyrightText: 2023 Leon van Kammen/NLNET
//
// SPDX-License-Identifier: MPL-2.0

xrf.frag   = {dynamic:{}}
xrf.model  = {}
xrf.mixers = []

xrf.init = ((init) => function(opts){
  // operate in own subscene
  let scene = new opts.THREE.Group()
  xrf.clock  = new opts.THREE.Clock()
  opts.scene.add(scene)
  opts.sceneRoot = opts.scene
  opts.scene = scene 
  init(opts)
  //if( opts.loaders ) Object.values(opts.loaders).map( xrf.patchLoader )

  xrf.patchRenderer(opts)
  xrf.navigator.init()
  xrf.interactive = xrf.interactiveGroup( xrf.THREE, xrf.renderer, xrf.camera)
  // return xrfragment lib as 'xrf' query functor (like jquery)
  for ( let i in xrf ) xrf.query[i] = xrf[i] 

  return xrf.query
})(xrf.init)

xrf.patchRenderer = function(opts){
  let {renderer,camera} = opts
  renderer.xr.addEventListener( 'sessionstart', () => xrf.baseReferenceSpace = renderer.xr.getReferenceSpace() );
  renderer.xr.enabled = true;
  renderer.render = ((render) => function(scene,camera){
    // update clock
    let time = xrf.clock.delta = xrf.clock.getDelta()
    xrf.emit('render',{scene,camera,time,render}) // allow fragments to do something at renderframe
    render(scene,camera)
    xrf.emit('renderPost',{scene,camera,time,render,renderer}) // allow fragments to do something after renderframe
  })(renderer.render.bind(renderer))

}

xrf.getFile = (url) => url.split("/").pop().replace(/#.*/,'')

// parseModel event is essential for src.js to hook into embedded loaded models
xrf.parseModel = function(model,url){
  let file               = xrf.getFile(url)
  model.file             = file
  model.isXRF            = true
  model.scene.isXRFRoot  = true
  model.scene.traverse( (n) => n.isXRF = true ) // mark for deletion during reset()

  xrf.emit('parseModel',{model,url,file})
}

xrf.loadModel = function(model,url,noadd){
  let URI = xrfragment.URI.toAbsolute( xrf.navigator.URI, url )
  let {directory,file,fragment,fileExt} = URI;
  model.file = URI.file
  xrf.model = model 

  if( !model.isXRF ) xrf.parseModel(model,url.replace(directory,"")) // this marks the model as an XRF model

  if(xrf.debug ) model.animations.map( (a) => console.log("anim: "+a.name) )

  // spec: 1. generate the XRWG
  xrf.XRWG.generate({model,scene:model.scene})

  // spec: 2. init metadata inside model for non-SRC data
  if( !model.isSRC ){
    model.scene.traverse( (mesh) => xrf.parseModel.metadataInMesh(mesh,model) )
  }
  // spec: 1. execute the default predefined view '#' (if exist) (https://xrfragment.org/#predefined_view)
  const defaultFragment = xrf.frag.defaultPredefinedViews({model,scene:model.scene})
  // spec: predefined view(s) & objects-of-interest-in-XRWG from URI (https://xrfragment.org/#predefined_view)
  let frag = xrf.hashbus.pub( url, model) // and eval URI XR fragments 
  
  if( !noadd ) xrf.add( model.scene )

  // only change url when loading *another* file
  fragment = fragment || defaultFragment || ''
  xrf.navigator.pushState( URI.external ? URI.URN + URI.file : URI.file, fragment.replace(/^#/,'') )
  //if( fragment )  xrf.navigator.updateHash(fragment)

  xrf.emit('navigateLoaded',{url,model})
}


xrf.parseModel.metadataInMesh =  (mesh,model) => { 
  if( mesh.userData ){
    let frag = {}
    for( let k in mesh.userData ) xrf.Parser.parse( k, mesh.userData[k], frag )
    for( let k in frag ){
      let opts = {frag, mesh, model, camera: xrf.camera, scene: model.scene, renderer: xrf.renderer, THREE: xrf.THREE, hashbus: xrf.hashbus }
      mesh.userData.XRF = frag // allow fragment impl to access XRF obj already
      xrf.emit('frag2mesh',opts)
      .then( () => {
        xrf.hashbus.pub.fragment(k, {...opts, skipXRWG:true}) 
      })
    }
  }
}

xrf.getLastModel = ()           => xrf.model.last 

xrf.reset = () => {

  // allow others to reset certain events 
  xrf.emit('reset',{})

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
  // also remove XRF objects from global scene
  let nodes = []
  xrf.scene.traverse( (child) => child.isXRF && (nodes.push(child)) )
  nodes.map( disposeObject )
  xrf.interactive.clear()
  xrf.layers = 0
}

xrf.add = (object) => {
  object.isXRF = true // mark for easy deletion when replacing scene
  xrf.scene.add(object)
}

xrf.hasNoMaterial = (mesh) => {
  const hasTexture        = mesh.material && mesh.material.map 
  const hasMaterialName   = mesh.material && mesh.material.name.length > 0 
  return mesh.geometry && !hasMaterialName && !hasTexture
}
