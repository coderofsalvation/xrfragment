// *TODO* use webgl instancing

xrf.frag.src = function(v, opts){

  opts.embedded = v // indicate embedded XR fragment
  let { mesh, model, camera, scene, renderer, THREE} = opts

  console.log("   └ instancing src")
  let src = new THREE.Group()
  let frag = xrfragment.URI.parse(v.string)

  const localSRC = () => {
    let obj

    // cherrypicking of object(s)
    if( !frag.q ){
      for( var i in frag ){
        if( scene.getObjectByName(i) ) src.add( obj = scene.getObjectByName(i).clone() )
        xrf.eval.fragment(i, Object.assign(opts,{frag, model,scene}))
      }
      if( src.children.length == 1 ) obj.position.set(0,0,0);
    }

    // filtering of objects using query
    if( frag.q ){
      src = scene.clone();
      src.isSRC = true;
      xrf.frag.q.filter(src,frag)
    }
    src.traverse( (m) => {
      m.isSRC = true
      if( m.userData && (m.userData.src || m.userData.href) ) return ; // prevent infinite recursion 
      xrf.eval.mesh(m,{scene,recursive:true})                          // cool idea: recursion-depth based distance between face & src
    })
    xrf.frag.src.scale( src, opts )
  }

  const externalSRC = () => {
    fetch(v.string, { method: 'HEAD' })
    .then( (res) => {
      console.log(`loading src ${v.string}`)
      let mimetype = res.headers.get('Content-type')
      console.log("src mimetype: "+mimetype)
      return xrf.frag.src.type[ mimetype ] ? xrf.frag.src.type[ mimetype ](v.string,opts) : xrf.frag.src.type.unknown(v.string,opts)
    })
    .finally( () => {
    })
    .catch( console.error )
  }

  if( v.string[0] == "#" ) setTimeout( localSRC, 10 ) // current file 
  else externalSRC()                                  // external file
}

// scale embedded XR fragments https://xrfragment.org/#scaling%20of%20instanced%20objects
xrf.frag.src.scale = function(scene, opts, url){
    let { mesh, model, camera, renderer, THREE} = opts
    let restrictToBoundingBox = mesh.geometry
    if( url ){
      let frag = xrfragment.URI.parse(url)
      console.log("parse url:"+url)
      console.log("children:"+scene.children.length)
      // scale URI XR Fragments (queries) inside src-value 
      for( var i in frag ){
        xrf.eval.fragment(i, Object.assign(opts,{frag, model:{scene},scene}))
      }
      //if( frag.q ) scene = frag.q.scene 
      //xrf.add( model.scene )
      xrf.eval( '#', {scene} )     // execute the default projection '#' (if exist)
      xrf.eval( url, {scene} )     // and eval URI XR fragments 
      //if( !hash.match(/pos=/) )  //  xrf.eval( '#pos=0,0,0' ) // set default position if not specified
    }
    if( restrictToBoundingBox ){ 
      // spec 3 of https://xrfragment.org/#src
      // spec 1 of https://xrfragment.org/#scaling%20of%20instanced%20objects  
      // normalize instanced objectsize to boundingbox
      let bboxMesh  = new THREE.Box3().setFromObject(mesh);
      let bboxScene = new THREE.Box3().setFromObject(scene);
      let maxScene  = bboxScene.max.y > bboxScene.max.x ? bboxScene.max.y : bboxScene.max.x
      let maxMesh   = bboxMesh.max.y  > bboxMesh.max.x  ? bboxMesh.max.y  : bboxMesh.max.x 
      let factor    = maxMesh > maxScene ? maxScene / maxMesh : maxMesh / maxScene
      scene.scale.multiplyScalar( factor )
    }else{
      // spec 4 of https://xrfragment.org/#src
      // spec 2 of https://xrfragment.org/#scaling%20of%20instanced%20objects
      scene.scale.multiply( mesh.scale ) 
    }
    scene.isXRF = model.scene.isSRC = true
    mesh.add( scene )
    if( !opts.recursive && mesh.material ) mesh.material.visible = false // lets hide the preview object because deleting disables animations+nested objs
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

xrf.frag.src.type['model/gltf+json'] = function( url, opts ){
  return new Promise( (resolve,reject) => {
    let {urlObj,dir,file,hash,ext} = xrf.parseUrl(url)
    let loader

    const Loader = xrf.loaders[ext]
    if( !Loader ) throw 'xrfragment: no loader passed to xrfragment for extension .'+ext 
    if( !dir.match("://") ){ // force relative path 
      dir = dir[0] == '.' ? dir : `.${dir}`
      loader = new Loader().setPath( dir )
    }else loader = new Loader()

    const onLoad = (model) => {
      xrf.frag.src.scale( model.scene, {...opts, model, scene: model.scene}, url )
      resolve(model)
    }

    loader.load(url, onLoad )
  })
}

/*
 * mimetype: image/png 
 * mimetype: image/jpg 
 * mimetype: image/gif 
 */

xrf.frag.src.type['image/png'] = function(url,opts){
  let {mesh} = opts
  let restrictToBoundingBox = mesh.geometry
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

