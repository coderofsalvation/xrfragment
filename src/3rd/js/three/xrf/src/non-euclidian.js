// spec 8: https://xrfragment.org/doc/RFC_XR_Macros.html#embedding-xr-content-using-src

xrf.portalNonEuclidian = function(opts){
  let { frag, mesh, model, camera, scene, renderer} = opts


  mesh.portal = {
    pos: mesh.position.clone(),
    posWorld: new xrf.THREE.Vector3(),
    stencilRef: xrf.portalNonEuclidian.stencilRef,
    needUpdate: false
  }

  // turn mesh into stencilplane 
  xrf
  .portalNonEuclidian
  .setMaterial(mesh)
  .getWorldPosition(mesh.portal.posWorld)

  // allow objects to flip between original and stencil position (which puts them behind stencilplane)
  const addStencilFeature = (n) => { 
    if( n.stencil ) return n // run once
    n.stencil = ( (pos,scale) => (sRef,newPos, newScale) => {
        n.position.copy( sRef == 0 ? pos   : newPos )
        if( sRef > 0 ) n.scale.multiply( newScale )
        else           n.scale.copy( scale )
        xrf.portalNonEuclidian.selectStencil(n, sRef )
        n.updateMatrixWorld(true)
      }
    )( n.position.clone(), n.scale.clone() )
    return n
  }

  // collect related objects to render inside stencilplane
  let stencilObject           = scene.getObjectByName( mesh.userData.src.substr(1) ) // strip #
  if( !stencilObject ) return console.warn(`no objects were found (src:${mesh.userData.src}) for (portal)object name '${mesh.name}'`)
  let stencilObjects = [mesh,stencilObject]
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
      let newPos                     = mesh.portal.posWorld
      let newScale                   = mesh.scale 

      mesh.visible = true

      mesh.portal.stencilObjects.traverse( (n) => showPortal(n,false) && n.stencil && n.stencil(stencilRef,newPos,newScale) )
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
  
xrf.portalNonEuclidian.setMaterial = function(mesh){
  mesh.material = new xrf.THREE.MeshBasicMaterial({ color: 'white' });
  mesh.material.depthWrite   = true;
  mesh.material.depthTest    = false;
  mesh.material.colorWrite   = false;
  mesh.material.stencilWrite = true;
  mesh.material.stencilRef   = xrf.portalNonEuclidian.stencilRef;
  mesh.material.stencilFunc  = THREE.AlwaysStencilFunc;
  mesh.material.stencilZPass = THREE.ReplaceStencilOp;
  mesh.material.stencilFail  = THREE.ReplaceStencilOp;
  mesh.material.stencilZFail = THREE.ReplaceStencilOp;
  return mesh
}


xrf.portalNonEuclidian.stencilRef = 1
