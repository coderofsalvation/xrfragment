// *TODO* use webgl instancing

xrf.frag.src = function(v, opts){
  opts.embedded = v // indicate embedded XR fragment
  let { mesh, model, camera, scene, renderer, THREE, hashbus, frag} = opts

  const hasMaterialName   = mesh.material && mesh.material.name.length > 0 
  const hasTexture        = mesh.material && mesh.material.map 
  const isPlane           = mesh.geometry && mesh.geometry.attributes.uv && mesh.geometry.attributes.uv.count == 4 
  const hasLocalSRC       = mesh.userData.src  != undefined && mesh.userData.src[0] == '#'

  let src;
  let url      = v.string
  let vfrag    = xrfragment.URI.parse(url)

  // handle non-euclidian planes
  if( mesh.geometry && !hasMaterialName && !hasTexture && hasLocalSRC && isPlane ){
    return xrf.portalNonEuclidian(opts)
  }

  const addModel = (model,url,frag) => {
    let scene = model.scene
    xrf.frag.src.filterScene(scene,{...opts,frag})
    xrf.frag.src.scale( scene, opts, url )
    //enableSourcePortation(scene)
    mesh.add(model.scene)
    mesh.traverse( (n) => n.isSRC = n.isXRF = true ) // mark everything SRC
    xrf.emit('parseModel', {...opts, scene, model}) 
    if( mesh.material ) mesh.material.visible = false // hide placeholder object
  }

  const enableSourcePortation = (src) => {
    // show sourceportation clickable plane
    if( vfrag.href || v.string[0] == '#' ) return
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
  }

  const externalSRC = (url,frag,src) => {
    fetch(url, { method: 'HEAD' })
    .then( (res) => {
      console.log(`loading src ${url}`)
      let mimetype = res.headers.get('Content-type')
      if( url.replace(/#.*/,'').match(/\.(gltf|glb)$/)    ) mimetype = 'gltf'
      //if( url.match(/\.(fbx|stl|obj)$/) ) mimetype = 
      opts = { ...opts, src, frag, mimetype }
      return xrf.frag.src.type[ mimetype ] ? xrf.frag.src.type[ mimetype ](url,opts) : xrf.frag.src.type.unknown(url,opts)
    })
    .then( (model) => {
      if( model && model.scene ) addModel(model, url, frag )
    })
    .finally( () => { })
    .catch( console.error )
  }

  if( url[0] == "#" ){ 
    let _model = {
      animations: model.animations,
      scene: scene.clone()
    }
    _model.scenes = [_model.scene]
    addModel(_model,url,vfrag)    // current file 
  }else externalSRC(url,vfrag)   // external file
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

  xrf.filter.scene({scene,frag})
  if( scene.children.length == 1 ) scene.children[0].position.set(0,0,0)
 
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
