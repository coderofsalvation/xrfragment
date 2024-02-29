xrf.frag   = {dynamic:{}}
xrf.model  = {}
xrf.mixers = []

xrf.init = ((init) => function(opts){
  let scene = new opts.THREE.Group()
  opts.scene.add(scene)
  opts.scene = scene
  init(opts)
  //if( opts.loaders ) Object.values(opts.loaders).map( xrf.patchLoader )

  xrf.patchRenderer(opts)
  xrf.navigator.init()
  // return xrfragment lib as 'xrf' query functor (like jquery)
  for ( let i in xrf ) xrf.query[i] = xrf[i] 

  if( xrf.debug ) xrf.stats()

  return xrf.query
})(xrf.init)

xrf.patchRenderer = function(opts){
  let {renderer,camera} = opts
  renderer.xr.addEventListener( 'sessionstart', () => xrf.baseReferenceSpace = renderer.xr.getReferenceSpace() );
  renderer.xr.enabled = true;
  xrf.clock = new xrf.THREE.Clock()
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
  model.scene.traverse( (n) => n.isXRF = true ) // mark for deletion during reset()

  xrf.emit('parseModel',{model,url,file})
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
  let nodes = []
  xrf.scene.traverse( (child) => child.isXRF && (nodes.push(child)) )
  nodes.map( disposeObject ) // leave non-XRF objects intact
  xrf.interactive = xrf.interactiveGroup( xrf.THREE, xrf.renderer, xrf.camera)
  xrf.add( xrf.interactive )
  xrf.layers = 0
}

xrf.parseUrl = (url) => {
  let urlExHash = url.replace(/#.*/,'')
  let urlObj,file
  let   store = {}
  try{
    urlObj = new URL( urlExHash.match(/:\/\//) ? urlExHash : String(`https://fake.com/${url}`).replace(/\/\//,'/') )
    file = urlObj.pathname.substring(urlObj.pathname.lastIndexOf('/') + 1);
    let   search = urlObj.search.substr(1).split("&")
    for( let i in search )  store[  (search[i].split("=")[0])  ]  = search[i].split("=")[1] || ''
  }catch(e){ }
  let   hashmap = url.match("#") ? url.replace(/.*#/,'').split("&") : []
  for( let i in hashmap ) store[  (hashmap[i].split("=")[0]) ]  = hashmap[i].split("=")[1] || ''
  let   dir  = url.substring(0, url.lastIndexOf('/') + 1)
  const hash = url.match(/#/) ? url.replace(/.*#/,'') : ''
  const ext  = file.split('.').pop()
  return {urlObj,dir,file,hash,ext,store}
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
