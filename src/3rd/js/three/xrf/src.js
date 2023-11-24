// *TODO* use webgl instancing

xrf.frag.src = function(v, opts){
  opts.embedded = v // indicate embedded XR fragment
  let { mesh, model, camera, scene, renderer, THREE, hashbus, frag} = opts

  let url      = v.string
  let srcFrag  = opts.srcFrag = xrfragment.URI.parse(url)
  opts.isLocal = v.string[0] == '#'

  if( opts.isLocal ){
        xrf.frag.src.localSRC(url,srcFrag,opts)     // local
  }else xrf.frag.src.externalSRC(url,srcFrag,opts)  // external file
}

xrf.frag.src.addModel = (model,url,frag,opts) => {
  let {mesh} = opts
  let scene = model.scene
  xrf.frag.src.filterScene(scene,{...opts,frag})     // filter scene
  if( mesh.material ) mesh.material.visible = false  // hide placeholder object
  //enableSourcePortation(scene)
  if( xrf.frag.src.renderAsPortal(mesh) ){
    if( !opts.isLocal ) xrf.scene.add(scene)
    return xrf.portalNonEuclidian({...opts,model,scene:model.scene})
  }else{
    xrf.frag.src.scale( scene, opts, url )           // scale scene
    mesh.add(scene)
  }
  // flag everything isSRC & isXRF
  mesh.traverse( (n) => { n.isSRC = n.isXRF = n[ opts.isLocal ? 'isSRCLocal' : 'isSRCExternal' ] = true })
  xrf.emit('parseModel', {...opts, scene, model}) 
}

xrf.frag.src.renderAsPortal = (mesh) => {
  // *TODO* should support better isFlat(mesh) check
  const isPlane           = mesh.geometry && mesh.geometry.attributes.uv && mesh.geometry.attributes.uv.count == 4 
  return xrf.hasNoMaterial(mesh) && isPlane
}

xrf.frag.src.enableSourcePortation = (src) => {
  // show sourceportation clickable plane
  if( srcFrag.href || v.string[0] == '#' ) return
  let scale = new THREE.Vector3()
  let size  = new THREE.Vector3()
  mesh.getWorldScale(scale)
  new THREE.Box3().setFromObject(src).getSize(size)
  const geo    = new THREE.SphereGeometry( Math.max(size.x, size.y, size.z) / scale.x, 10, 10 )
  const mat    = new THREE.MeshBasicMaterial()
  mat.transparent = true
  mat.roughness = 0.05
  mat.metalness = 1
  mat.opacity = 0
  const cube = new THREE.Mesh( geo, mat )
  console.log("todo: sourceportate")
  return xrf.frag.src
}

xrf.frag.src.externalSRC = (url,frag,opts) => {
  fetch(url, { method: 'HEAD' })
  .then( (res) => {
    console.log(`loading src ${url}`)
    let mimetype = res.headers.get('Content-type')
    if( url.replace(/#.*/,'').match(/\.(gltf|glb)$/)    ) mimetype = 'gltf'
    //if( url.match(/\.(fbx|stl|obj)$/) ) mimetype = 
    opts = { ...opts, frag, mimetype }
    return xrf.frag.src.type[ mimetype ] ? xrf.frag.src.type[ mimetype ](url,opts) : xrf.frag.src.type.unknown(url,opts)
  })
  .then( (model) => {
    if( model && model.scene ) xrf.frag.src.addModel(model, url, frag, opts )
  })
  .finally( () => { })
  .catch( console.error )
  return xrf.frag.src
}

xrf.frag.src.localSRC = (url,frag,opts) => {
  let {model,scene} = opts
  let _model = {
    animations: model.animations,
    scene: scene.clone()
  }
  _model.scenes = [_model.scene]
  xrf.frag.src.addModel(_model,url,frag, opts)    // current file 
}

// scale embedded XR fragments https://xrfragment.org/#scaling%20of%20instanced%20objects
xrf.frag.src.scale = function(scene, opts, url){
    let { mesh, model, camera, renderer, THREE} = opts

    // remove invisible objects (hidden by selectors) which might corrupt boundingbox size-detection 
    let cleanScene = scene.clone()
    if( !cleanScene ) debugger
    let remove = []
    const notVisible = (n) => !n.visible || (n.material && !n.material.visible)
    cleanScene.traverse( (n) => notVisible(n) && n.children.length == 0 && (remove.push(n)) )
    remove.map( (n) => n.removeFromParent() )

    let restrictTo3DBoundingBox = mesh.geometry
    if( restrictTo3DBoundingBox ){ 
      // spec 3 of https://xrfragment.org/#src
      // spec 1 of https://xrfragment.org/#scaling%20of%20instanced%20objects  
      // normalize instanced objectsize to boundingbox
      let sizeFrom  = new THREE.Vector3()
      let sizeTo    = new THREE.Vector3()
      let empty = new THREE.Object3D()
      new THREE.Box3().setFromObject(mesh).getSize(sizeTo)
      new THREE.Box3().setFromObject(cleanScene).getSize(sizeFrom)
      let ratio = sizeFrom.divide(sizeTo)
      scene.scale.multiplyScalar( 1.0 / Math.max(ratio.x, ratio.y, ratio.z));
    }else{
      // spec 4 of https://xrfragment.org/#src
      // spec 2 of https://xrfragment.org/#scaling%20of%20instanced%20objects
      scene.scale.multiply( mesh.scale ) 
    }
    scene.isXRF = model.scene.isSRC = true
}

xrf.frag.src.filterScene = (scene,opts) => {
  let { mesh, model, camera, renderer, THREE, hashbus, frag} = opts

  xrf.filter.scene({scene,frag,reparent:true})
 
  scene.traverse( (m) => {
    if( m.userData && (m.userData.src || m.userData.href) ) return ; // prevent infinite recursion 
    hashbus.pub.mesh(m,{scene,recursive:true})                       // cool idea: recursion-depth based distance between face & src
  })
  return scene
}

/*
 * replace the src-mesh with the contents of the src
 */

xrf.frag.src.type = {}

/*
 * mimetype: unknown 
 */

xrf.frag.src.type['unknown'] = function( url, opts ){
  return new Promise( (resolve,reject) => {
    reject(`${url} mimetype '${opts.mimetype}' not found or supported (yet)`)
  })
}
