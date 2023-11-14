xrf.portalNonEuclidian = function(opts){
  let { frag, mesh, model, camera, scene, renderer} = opts

  // turn plane into stencilplane 
  mesh.material = new xrf.THREE.MeshBasicMaterial({ color: 'white' });
  mesh.material.depthWrite   = true;
  mesh.material.depthTest    = false;
  mesh.material.colorWrite   = false;
  mesh.material.stencilWrite = true;
  mesh.material.stencilRef   = xrf.portalNonEuclidian.stencilRef;
  mesh.material.stencilFunc  = THREE.AlwaysStencilFunc;
  mesh.material.stencilZPass = THREE.ReplaceStencilOp;
  //mesh.material.side         = THREE.DoubleSide  // *TODO* this requires flipping normals based on camera orientation
  mesh.portal = {
    pos: mesh.position.clone(),
    posWorld: new xrf.THREE.Vector3(),
    stencilRef: xrf.portalNonEuclidian.stencilRef,
    needUpdate: false
  }

  mesh.getWorldPosition(mesh.portal.posWorld)

  // allow objects to flip between original and stencil position (which puts them behind stencilplane)
  const addStencilFeature = (n) => { 
    if( n.stencil ) return n // run once
    n.stencil = ( (pos ) => (sRef,newPos) => {
        n.position.copy( sRef == 0 ? pos : newPos )
        xrf.portalNonEuclidian.selectStencil(n, sRef )
        n.updateMatrixWorld(true)
      }
    )( n.position.clone() )
    return n
  }

  // collect related objects from XRWG to render inside stencilplane
  let world      = scene.getObjectByName( mesh.userData.src.substr(1) ) // strip #
  if( !world ) return console.warn(`no objects were found (src:${mesh.userData.src}) for (portal)object name '${mesh.name}'`)
  let stencilObjects = [mesh,world]
  stencilObjects = stencilObjects
                .filter( (n) => !n.portal ) // filter out (self)references to portals (prevent recursion)
                .map(addStencilFeature)

  //// add missing lights to make sure things get lit properly 
  xrf.scene.traverse( (n) => n.isLight && 
                             !stencilObjects.find( (o) => o.uuid == n.uuid ) && 
                             stencilObjects.push(n)
  )

  // put it into a scene (without .add() because it reparents objects) so we can render it separately
  mesh.portal.stencilObjects = new xrf.THREE.Scene()
  mesh.portal.stencilObjects.children = stencilObjects 

  // enable the stencil-material of the stencil objects to prevent stackoverflow (portal in portal rendering)
  const showPortal = (n,show) => {
    if( n.portal ) n.visible = show
    return true
  }
  
  mesh.onBeforeRender = function(renderer, scene, camera, geometry, material, group ){
    mesh.visible = false
  }

  mesh.onAfterRender = function(renderer, scene, camera, geometry, material, group ){
    mesh.portal.needUpdate = true
  }

  xrf.addEventListener('renderPost', (opts) => {
    if( mesh.portal && mesh.portal.needUpdate ){  
      let {scene,camera,time,render} = opts
      let stencilRef                 = mesh.portal.stencilRef
      let stencilPos                 = mesh.portal.posWorld

      mesh.visible = true

      mesh.portal.stencilObjects.traverse( (n) => showPortal(n,false) && n.stencil && n.stencil(stencilRef,stencilPos) )
      renderer.autoClear        = false 
      renderer.clearDepth()
      render( mesh.portal.stencilObjects, camera )
      mesh.portal.stencilObjects.traverse( (n) =>  showPortal(n,true) && n.stencil && (n.stencil(0)) )

      mesh.portal.needUpdate = false
    }
  })

  xrf.portalNonEuclidian.stencilRef += 1 // each portal has unique stencil id
  console.log(`enabling portal for object '${mesh.name}' (stencilRef:${mesh.portal.stencilRef})`)

}

xrf.portalNonEuclidian.selectStencil = (n, stencilRef, nested) => {
  if( n.material ){
    n.material.stencilRef   = stencilRef 
    n.material.stencilWrite = stencilRef > 0 
    n.material.stencilFunc  = xrf.THREE.EqualStencilFunc;
  }
  if( n.children && !nested ) n.traverse( (m) => !m.portal && (xrf.portalNonEuclidian.selectStencil(m,stencilRef,true)) )
}

xrf.portalNonEuclidian.stencilRef = 1
