// *TODO* use webgl instancing

xrf.frag.src = function(v, opts){

  opts.embedded = v // indicate embedded XR fragment
  let { mesh, model, camera, scene, renderer, THREE, hashbus} = opts

  console.log("   └ instancing src")
  let src;
  let url      = v.string
  let frag     = xrfragment.URI.parse(url)
  opts.isPlane = mesh.geometry && mesh.geometry.attributes.uv && mesh.geometry.attributes.uv.count == 4 

  const addScene = (scene,url,frag) => {
    src = xrf.frag.src.filterScene(scene,{...opts,frag})
    xrf.frag.src.scale( src, opts, url )
    xrf.frag.src.eval( src, opts, url )
    mesh.add(src)
    mesh.traverse( (n) => n.isSRC = n.isXRF = true )
    if( mesh.material ) mesh.material.visible = false
  }

  const externalSRC = (url,frag,src) => {
    fetch(url, { method: 'HEAD' })
    .then( (res) => {
      console.log(`loading src ${url}`)
      let mimetype = res.headers.get('Content-type')
      if( url.replace(/#.*/,'').match(/\.(gltf|glb)$/)    ) mimetype = 'gltf'
      //if( url.match(/\.(fbx|stl|obj)$/) ) mimetype = 
      console.log("src mimetype: "+mimetype)
      opts = { ...opts, src, frag }
      return xrf.frag.src.type[ mimetype ] ? xrf.frag.src.type[ mimetype ](url,opts) : xrf.frag.src.type.unknown(url,opts)
    })
    .then( (model) => {
      if( model && model.scene ) addScene(model.scene, url, frag )
    })
    .finally( () => { })
    .catch( console.error )
  }

  if( url[0] == "#" ) addScene(scene,url,frag)    // current file 
  else externalSRC(url,frag)                      // external file
}

xrf.frag.src.eval = function(scene, opts, url){
    let { mesh, model, camera, renderer, THREE, hashbus} = opts
    if( url ){
      console.log(mesh.name+" url="+url)
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
      console.log("normal scale: "+url)
      scene.scale.multiply( mesh.scale ) 
    }
    scene.isXRF = model.scene.isSRC = true
}

xrf.frag.src.filterScene = (scene,opts) => {
  let { mesh, model, camera, renderer, THREE, hashbus, frag} = opts
  let obj, src
  // cherrypicking of object(s)
  if( !frag.q ){
    src = new THREE.Group()
    if( Object.keys(frag).length > 0 ){
      for( var i in frag ){
        if( scene.getObjectByName(i) ){
          src.add( obj = scene.getObjectByName(i).clone(true) )
        }
        hashbus.pub.fragment(i, Object.assign(opts,{frag, model,scene}))
      }
    }else src = scene.clone(true)
    if( src.children.length == 1 ) obj.position.set(0,0,0);
  }

  // filtering of objects using query
  if( frag.q ){
    src = scene.clone(true);
    xrf.frag.q.filter(src,frag)
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
    reject(`${url} mimetype not supported (yet)`)
  })
}

/*
 * mimetype: model/gltf+json
 */

xrf.frag.src.type['gltf'] = function( url, opts ){
  return new Promise( (resolve,reject) => {
    let {mesh,src} = opts
    let {urlObj,dir,file,hash,ext} = xrf.parseUrl(url)
    let loader

    const Loader = xrf.loaders[ext]
    if( !Loader ) throw 'xrfragment: no loader passed to xrfragment for extension .'+ext 
    if( !dir.match("://") ){ // force relative path 
      dir = dir[0] == './' ? dir : `./${dir}`
      loader = new Loader().setPath( dir )
    }else loader = new Loader()

    loader.load(url, (model) => {
      resolve(model)
    })
  })
}

/*
 * mimetype: image/png 
 * mimetype: image/jpg 
 * mimetype: image/gif 
 */

xrf.frag.src.type['image/png'] = function(url,opts){
  let {mesh} = opts
  let restrictTo3DBoundingBox = mesh.geometry
  const texture = new THREE.TextureLoader().load( url );
	texture.colorSpace = THREE.SRGBColorSpace;

  //const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ 
    map: texture, 
    transparent: url.match(/(png|gif)/) ? true : false,
    side: THREE.DoubleSide,
    color: 0xFFFFFF,
    opacity:1
  });

  // stretch image by pinning uv-coordinates to corners 
  if( mesh.geometry ){
    if( mesh.geometry.attributes.uv ){ // buffergeometries 
      let uv = mesh.geometry.attributes.uv;
      //       i  u  v
      uv.setXY(0, 0, 0 )
      uv.setXY(1, 1, 0 )
      uv.setXY(2, 0, 1 )
      uv.setXY(3, 1, 1 )
    }else {
      console.warn("xrfragment: uv's of ${url} might be off for non-buffer-geometries *TODO*")
      //if( geometry.faceVertexUvs ){
      // *TODO* force uv's of dynamically created geometries (in threejs)
      //}
    }
  }
  mesh.material = material
}
xrf.frag.src.type['image/gif'] = xrf.frag.src.type['image/png']
xrf.frag.src.type['image/jpg'] = xrf.frag.src.type['image/png']

