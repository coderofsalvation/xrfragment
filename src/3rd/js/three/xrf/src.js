// SPDX-FileCopyrightText: 2023 Leon van Kammen/NLNET
//
// SPDX-License-Identifier: MPL-2.0

// *TODO* use webgl instancing

xrf.frag.src = function(v, opts){
  opts.embedded = v // indicate embedded XR fragment
  let { mesh, model, camera, scene, renderer, THREE, hashbus, frag} = opts

  if( mesh.isSRC ) return // only embed src once 

  let url       = xrf.frag.src.expandURI( mesh, v.string )
  let srcFrag   = opts.srcFrag = xrfragment.URI.parse(url).XRF
  opts.isLocal  = v.string[0] == '#'
  opts.isPortal = xrf.frag.src.renderAsPortal(mesh)
  opts.isSRC    = mesh.isSRC = true 

  if(xrf.debug) console.log(`src.js: instancing ${opts.isLocal?'local':'remote'} object ${url}`)

  if( opts.isLocal ){
    xrf.frag.src.localSRC(url,srcFrag,opts)         // local
  }else xrf.frag.src.externalSRC(url,srcFrag,opts)  // external file

  xrf.hashbus.pub( url.replace(/.*#/,''), mesh)     // eval src-url fragments
}

xrf.frag.src.expandURI = function(mesh,uri){
  if( uri ) mesh.userData.srcTemplate = uri
  mesh.userData.src = xrf.URI.template( mesh.userData.srcTemplate, xrf.URI.vars.__object )
  return mesh.userData.src
}

xrf.frag.src.addModel = (model,url,frag,opts) => {
  let {mesh} = opts
  let scene = model.scene
  scene = xrf.frag.src.filterScene(scene,{...opts,frag})         // get filtered scene
  if( mesh.material && mesh.userData.src ) mesh.material.visible = false  // hide placeholder object

  if( opts.isPortal ){
    xrf.portalNonEuclidian({...opts,model,scene:model.scene})
    // only add external objects, because 
    // local scene-objects are already added to scene
    if( !opts.isLocal ) xrf.scene.add(scene) 
  }else{
    xrf.frag.src.scale( scene, opts, url )           // scale scene
    mesh.add(scene)
  }
  xrf.frag.src.enableSourcePortation({...opts, scene,mesh,url,model})
  // flag everything isSRC & isXRF
  mesh.traverse( (n) => { n.isSRC = n.isXRF = n[ opts.isLocal ? 'isSRCLocal' : 'isSRCExternal' ] = true })
 
  xrf.emit('parseModel', {...opts, isSRC:true, mesh, model}) // this will execute all embedded metadata/fragments e.g.
}

xrf.frag.src.renderAsPortal = (mesh) => {
  // *TODO* should support better isFlat(mesh) check
  const isPlane           = mesh.geometry && mesh.geometry.attributes.uv && mesh.geometry.attributes.uv.count == 4 
  return xrf.hasNoMaterial(mesh) && isPlane
}

xrf.frag.src.enableSourcePortation = (opts) => {
  let {scene,mesh,url,model,THREE} = opts
  if( url[0] == '#' ) return

  url = url.replace(/(&)?[-][\w-+\.]+(&)?/g,'&') // remove negative selectors to refer to original scene

  if( !mesh.userData.href ){ 
    // show sourceportation clickable sphere for non-portals
    let scale = new THREE.Vector3()
    let size  = new THREE.Vector3()
    scene.getWorldScale(scale)
    new THREE.Box3().setFromObject(scene).getSize(size)
    const geo    = new THREE.SphereGeometry( Math.max(size.x, size.y, size.z) * scale.x * 0.33, 10, 10 )
    const mat    = new THREE.MeshBasicMaterial()
    mat.visible = false // we just use this for collisions
    const sphere = new THREE.Mesh( geo, mat )
    sphere.isXRF = true
    // reparent scene to sphere
    let children = mesh.children
    mesh.children = []
    mesh.add(sphere)
    children.map( (c) => sphere.add(c) )
    // make sphere clickable/hoverable
    let frag = {}
    xrf.Parser.parse("href", url, frag)
    sphere.userData = scene.userData  // allow rich href notifications/hovers
    sphere.userData.href = url.replace(/#.*/,'') // remove fragments to refer to original scene
    sphere.userData.XRF  = frag
    xrf.hashbus.pub.fragment("href", {...opts, mesh:sphere, frag, skipXRWG:true, renderer:xrf.renderer, camera:xrf.camera }) 
  }
  for ( let i in scene.userData ) {
    if( !mesh.userData[i] ) mesh.userData[i] = scene.userData[i] // allow rich href notifications/hovers
  }
}

xrf.frag.src.externalSRC = (url,frag,opts) => {
  fetch(url, { method: 'HEAD' })
  .then( (res) => {
    let mimetype = res.headers.get('Content-type')
    if(xrf.debug != undefined ) console.log("HEAD "+url+" => "+mimetype)
    if( url.replace(/#.*/,'').match(/\.(gltf|glb)$/)     ) mimetype = 'gltf'
    if( url.replace(/#.*/,'').match(/\.(frag|fs|glsl)$/) ) mimetype = 'x-shader/x-fragment'
    if( url.replace(/#.*/,'').match(/\.(vert|vs)$/)      ) mimetype = 'x-shader/x-fragment'
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
  let {model,mesh,scene} = opts
  //setTimeout( (mesh,scene) => {
    if( mesh.material ) mesh.material = mesh.material.clone() // clone, so we can individually highlight meshes
    let _model = {
      animations: model.animations,
      scene: scene.clone()
    }
    _model.scene.traverse( (n) => n.isXRF = true )  // make sure they respond to xrf.reset()
    _model.scenes = [_model.scene]
    xrf.frag.src.addModel(_model,url,frag, opts)    // current file 
  //},1000,mesh,scene )
}

// scale embedded XR fragments https://xrfragment.org/#scaling%20of%20instanced%20objects
xrf.frag.src.scale = function(scene, opts, url){
    let { mesh, model, camera, renderer, THREE} = opts

    // remove invisible objects (hidden by selectors) which might corrupt boundingbox size-detection 
    let cleanScene = scene.clone()
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
}

xrf.frag.src.filterScene = (scene,opts) => {
  let { mesh, model, camera, renderer, THREE, hashbus, frag} = opts

  scene = xrf.filter.scene({scene,frag,reparent:true}) //,copyScene: opts.isPortal})

  if( !opts.isLocal ){
    scene.traverse( (m) => {
      if( m.userData && (m.userData.src || m.userData.href) ) return ; // prevent infinite recursion 
      xrf.parseModel.metadataInMesh(m,{scene,recursive:true})
    })
  }
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
