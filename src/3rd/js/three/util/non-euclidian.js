xrf.portalNonEuclidian = function(opts){
  let { frag, mesh, model, camera, scene, renderer, stencilObjects} = opts

  // turn plane into stencilplane 
  mesh.material = new xrf.THREE.MeshPhongMaterial({ color: 'green' });
  mesh.material.depthWrite   = false;
  mesh.material.stencilWrite = true;
  mesh.material.stencilRef   = xrf.portalNonEuclidian.stencilRef;
  mesh.material.stencilFunc  = THREE.AlwaysStencilFunc;
  mesh.material.stencilZPass = THREE.ReplaceStencilOp;
  //mesh.material.side         = THREE.DoubleSide  // *TODO* this requires flipping normals based on camera orientation
  mesh.portal = {
    stencilRef: xrf.portalNonEuclidian.stencilRef
  }

  let stencilPos = new xrf.THREE.Vector3()
  mesh.getWorldPosition(stencilPos)

  // allow objects to flip between original and stencil position (which puts them behind stencilplane)
  const addStencilFeature = (n) => { 
    n.stencil = (
      (pos,stencilPos, stencilMat, mat ) => (enabled) => {
        let sRef          = enabled ? mesh.portal.stencilRef : 0
        stencilMat.depthTest = false
        n.position.copy( enabled ? stencilPos : pos )
        n.material = enabled ? stencilMat : mat 
        xrf.portalNonEuclidian.selectStencil(n, sRef ) // disable depthtest of world-container (sky e.g.)
        n.traverse( (c) => !c.portal && (xrf.portalNonEuclidian.selectStencil(c,sRef)) )
      }
    )( n.position.clone(), stencilPos, n.material.clone(), n.material )
    return n
  }

  // collect related objects from XRWG to render inside stencilplane
  if( stencilObjects.length == 0 ) return console.warn(`no objects are tagged with (portal)object name '${mesh.name}'`)
  stencilObjects = stencilObjects
                .filter( (n) => !n.portal ) // filter out (self)references to portals (prevent recursion)
                .map(addStencilFeature)
  
  // add missing lights to make sure things get lit properly 
  xrf.scene.traverse( (n) => n.isLight && 
                             !stencilObjects.find( (o) => o.uuid == n.uuid ) && 
                             (stencilObjects.push(n)) 
  )

  // put it into a scene (without .add() because it reparents objects) so we can render it separately
  mesh.stencilObjects = new xrf.THREE.Scene()
  mesh.stencilObjects.children = stencilObjects 

  // *TODO* stencilize any tagged plane without material

  // enable the stencil-material of the stencil objects 
  const showPortal = (n,show) => {
    if( n.portal ) n.visible = show
    return true
  }
  mesh.onAfterRender = function(renderer, scene, camera, geometry, material, group ){
    mesh.stencilObjects.traverse( (n) => showPortal(n,false) && n.stencil && (n.stencil(true)) )
    renderer.autoClear        = false 
    renderer.autoClearStencil = false
    //renderer.sortObjects      = false
    renderer.render( mesh.stencilObjects, camera )
    //renderer.sortObjects      = true
    mesh.stencilObjects.traverse( (n) =>  showPortal(n,true) && n.stencil && (n.stencil(false)) )
  }

  xrf.portalNonEuclidian.stencilRef += 1 // each portal has unique stencil id
  console.log("enabling portal for object '${mesh.name}'`")
}

xrf.portalNonEuclidian.selectStencil = (n, stencilRef, depthTest) => {
  if( n.material ){
    n.material.stencilRef = stencilRef 
    n.material.stencilWrite = stencilRef 
    n.material.stencilFunc = xrf.THREE.EqualStencilFunc;
  }
  n.updateMatrixWorld(true)
}

xrf.portalNonEuclidian.stencilRef = 1

// scan for non-euclidian portals (planes with nameless & textureless material which are tagged)
xrf.addEventListener('parseModel', (opts) => {
  let {model} = opts
  model.scene.traverse( (n) => {
    const hasMaterialName   = n.material && n.material.name.length > 0 
    const hasTexture        = n.material && n.material.map 
    const isPlane           = n.geometry && n.geometry.attributes.uv && n.geometry.attributes.uv.count == 4 
    const isHref            = n.userData.href != undefined
    const isSRC             = n.userData.src  != undefined || n.isSRC
    let stencilObjects      = XRWG.match(n.name,0)
    const hasReferences     = stencilObjects.length && stencilObjects[0].nodes.length > 1

    if( n.geometry && hasReferences && !hasMaterialName && !hasTexture && !isSRC && !n.isSRC){
      xrf.portalNonEuclidian({...opts, mesh:n, stencilObjects: stencilObjects[0].nodes})
    }
  })

})
