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
    src = xrf.frag.src.filterScene(scene,{...opts,frag})
    xrf.frag.src.scale( src, opts, url )
    xrf.frag.src.eval( src, opts, url )
    // allow 't'-fragment to setup separate animmixer
    enableSourcePortation(src)
    model.scene = src
    mesh.add(model.scene)
    mesh.traverse( (n) => n.isSRC = n.isXRF = true ) // mark everything SRC
    xrf.emit('parseModel', {...opts, scene:src, model}) 
    if( mesh.material ) mesh.material.visible = false
  }

  const enableSourcePortation = (src) => {
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
    //mesh.add(cube)
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
    let modelClone = {...model, scene: model.scene.clone()}
    modelClone.scenes = [modelClone.scene]
    modelClone.animations = modelClone.animations.map( (a) => a.clone() )
    addModel(modelClone,url,vfrag)    // current file 
  }else externalSRC(url,vfrag)        // external file
}

xrf.frag.src.eval = function(scene, opts, url){
    let { mesh, model, camera, renderer, THREE, hashbus} = opts
    if( url ){
      //let {urlObj,dir,file,hash,ext} = xrf.parseUrl(url)
      //let frag = xrfragment.URI.parse(url)
      //// scale URI XR Fragments (queries) inside src-value 
      //for( var i in frag ){
      //  hashbus.pub.fragment(i, Object.assign(opts,{frag, model:{scene},scene}))
      //}
      //hashbus.pub( '#', {scene} )                    // execute the default projection '#' (if exist)
      //hashbus.pub( url, {scene} )                    // and eval URI XR fragments 
    }
}

// scale embedded XR fragments https://xrfragment.org/#scaling%20of%20instanced%20objects
xrf.frag.src.scale = function(scene, opts, url){
    let { mesh, model, camera, renderer, THREE} = opts

    let restrictTo3DBoundingBox = mesh.geometry
    if( restrictTo3DBoundingBox ){ 
      // spec 3 of https://xrfragment.org/#src
      // spec 1 of https://xrfragment.org/#scaling%20of%20instanced%20objects  
      // normalize instanced objectsize to boundingbox
      let sizeFrom  = new THREE.Vector3()
      let sizeTo    = new THREE.Vector3()

      let empty = new THREE.Object3D()

// *TODO* exclude invisible objects from boundingbox size-detection
//
//      THREE.Box3.prototype.expandByObject = (function(expandByObject){
//        return function(object,precise){
//          return expandByObject.call(this, object.visible ? object : empty, precise)
//        }
//      })(THREE.Box3.prototype.expandByObject)

      new THREE.Box3().setFromObject(mesh).getSize(sizeTo)
      new THREE.Box3().setFromObject(scene).getSize(sizeFrom)
      let ratio = sizeFrom.divide(sizeTo)
      scene.scale.multiplyScalar( 1.0 / Math.max(ratio.x, ratio.y, ratio.z));
 //     let factor = getMax(sizeTo) < getMax(sizeFrom) ? getMax(sizeTo) / getMax(sizeFrom) : getMax(sizeFrom) / getMax(sizeTo)
 //     scene.scale.multiplyScalar( factor )
    }else{
      // spec 4 of https://xrfragment.org/#src
      // spec 2 of https://xrfragment.org/#scaling%20of%20instanced%20objects
      scene.scale.multiply( mesh.scale ) 
    }
    scene.isXRF = model.scene.isSRC = true
}

xrf.frag.src.filterScene = (scene,opts) => {
  let { mesh, model, camera, renderer, THREE, hashbus, frag} = opts
  let obj, src
  // cherrypicking of object(s)
  if( !frag.filter ){
    src = new THREE.Group()
    if( Object.keys(frag).length > 0 ){
      for( var i in frag ){
        if( scene.getObjectByName(i) ){
          src.add( obj = scene.getObjectByName(i).clone(true) )
        }
        hashbus.pub.fragment(i, Object.assign(opts,{frag, model,scene}))
      }
    }
    if( src.children.length == 1 ) obj.position.set(0,0,0);
  }

  // filtering of objects using query
  if( frag.filter ){
    console.warn("TODO: filter scene");
    src = scene
    xrf.filter.scene(src,frag)
  }
  src.traverse( (m) => {
    if( m.userData && (m.userData.src || m.userData.href) ) return ; // prevent infinite recursion 
    hashbus.pub.mesh(m,{scene,recursive:true})                       // cool idea: recursion-depth based distance between face & src
  })
  return src
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
