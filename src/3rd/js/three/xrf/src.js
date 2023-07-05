// *TODO* use webgl instancing

xrf.frag.src = function(v, opts){
  opts.embedded = v // indicate embedded XR fragment
  let { mesh, model, camera, scene, renderer, THREE} = opts

  console.log("   └ instancing src")
  let src = new THREE.Group()
  let frag = xrfragment.URI.parse(v.string)

  const localSRC = () => {
    
    // apply embedded XR fragments
    setTimeout( () => {
      // apply URI XR Fragments inside src-value 
      for( var i in frag ){
        xrf.eval.fragment(i, Object.assign(opts,{frag, model,scene}))
      }
      if( frag.q.query ){  
        let srcScene = frag.q.scene // three/xrf/q.js initializes .scene
        if( !srcScene || !srcScene.visible ) return 
        console.log("       └ inserting "+i+" (srcScene)")
        srcScene.position.set(0,0,0)
        srcScene.rotation.set(0,0,0)
        srcScene.traverse( (m) => {
          m.isSRC = true
          if( m.userData && (m.userData.src || m.userData.href) ) return ;//delete m.userData.src // prevent infinite recursion 
          xrf.eval.mesh(m,{scene,recursive:true}) 
        })
        console.dir(xrf)
        if( srcScene.visible ) src.add( srcScene )
      }
      xrf.frag.src.apply( src, opts )
    },10)
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

    //// apply URI XR Fragments inside src-value 
    //for( var i in frag ){
    //  xrf.eval.fragment(i, Object.assign(opts,{frag, model,scene}))
    //}
  }

  if( v.string[0] == "#" ) localSRC() // current file 
  else externalSRC()                  // external file
}

/*
 * replace the src-mesh with the contents of the src
 */

xrf.frag.src.apply = function(scene, opts, url){
    let { mesh, model, camera, renderer, THREE} = opts
    if( url ){
      let frag = xrfragment.URI.parse(url)
      console.log("parse url:"+url)
      console.log("children:"+scene.children.length)
      // apply URI XR Fragments (queries) inside src-value 
      for( var i in frag ){
        xrf.eval.fragment(i, Object.assign(opts,{frag, model:{scene},scene}))
      }
//      if( frag.q ) scene = frag.q.scene 
      console.dir(frag)
      //xrf.add( model.scene )
      xrf.eval( '#', {scene} )     // execute the default projection '#' (if exist)
      xrf.eval( url, {scene} )     // and eval URI XR fragments 
      //if( !hash.match(/pos=/) ) 
      //  xrf.eval( '#pos=0,0,0' ) // set default position if not specified
     
      //  apply bounding box scaling for external files
      let bboxMesh  = new THREE.Box3().setFromObject(mesh);
      let bboxScene = new THREE.Box3().setFromObject(scene);
      let maxScene  = bboxScene.max.y > bboxScene.max.x ? bboxScene.max.y : bboxScene.max.x
      let maxMesh   = bboxMesh.max.y > bboxMesh.max.x ? bboxMesh.max.y : bboxMesh.max.x
      let factor    = maxMesh > maxScene ? maxScene / maxMesh : maxMesh / maxScene
      scene.scale.multiplyScalar( factor )
    }
    scene.isXRF = model.scene.isSRC = true

    //scene.position.copy( mesh.position )
    //scene.rotation.copy( mesh.rotation )
    //scene.scale.copy( mesh.scale )
    scene.scale.multiply( mesh.scale )
    mesh.add( scene )
    if( !opts.recursive && mesh.material ) mesh.material.visible = false // lets hide the preview object because deleting disables animations+nested objs
}

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
      xrf.frag.src.apply( model.scene, {...opts, model, scene: model.scene}, url )
      resolve(model)
    }

    loader.load(url, onLoad )
  })
}
