// spec 8: https://xrfragment.org/doc/RFC_XR_Macros.html#embedding-xr-content-using-src

xrf.portalNonEuclidian = function(opts){
  let { frag, mesh, model, camera, scene, renderer} = opts


  mesh.portal = {
    pos: mesh.position.clone(),
    posWorld: new xrf.THREE.Vector3(),
    posWorldCamera: new xrf.THREE.Vector3(),
    stencilRef: xrf.portalNonEuclidian.stencilRef,
    needUpdate: false,
    stencilObject: false,
    cameraDirection: new THREE.Vector3(),
    cameraPosition: new THREE.Vector3(),
    raycaster: new THREE.Raycaster()
  }

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

  this.setupStencilObjects = (scene,opts) => {
    // collect related objects to render inside stencilplane
    let stencilObject         = opts.srcFrag.target ? scene.getObjectByName( opts.srcFrag.target.key ) : scene // strip #
    if( !stencilObject ) return console.warn(`no objects were found (src:${mesh.userData.src}) for (portal)object name '${mesh.name}'`)
    if( !opts.isLocal )  stencilObject.visible = false 
    let stencilObjects = [mesh,stencilObject]
    stencilObjects = stencilObjects
                     .filter( (n) => !n.portal ) // filter out (self)references to portals (prevent recursion)
                     .map(addStencilFeature)
    mesh.portal.stencilObject = stencilObject 

    //// add missing lights to make sure things get lit properly 
    xrf.scene.traverse( (n) => n.isLight && 
                               !stencilObjects.find( (o) => o.uuid == n.uuid ) && 
                               stencilObjects.push(n)
    )

    // put it into a scene (without .add() because it reparents objects) so we can render it separately
    mesh.portal.stencilObjects = new xrf.THREE.Scene()
    mesh.portal.stencilObjects.children = stencilObjects 

    xrf.portalNonEuclidian.stencilRef += 1 // each portal has unique stencil id
    console.log(`enabling portal for object '${mesh.name}' (stencilRef:${mesh.portal.stencilRef})`)

    // clone so it won't be affected by other fragments
    setTimeout( (mesh) => {
      if( mesh.material ) mesh.material = mesh.material.clone() // clone, so we can individually highlight meshes
    }, 0, mesh )

    return this
  }

  // enable the stencil-material of the stencil objects to prevent stackoverflow (portal in portal rendering)
  const showPortal = (n,show) => {
    if( n.portal ) n.visible = show
    return true
  }

  this.setupListeners = () => {

    mesh.onBeforeRender = function(renderer, scene, camera, geometry, material, group ){
    }

    mesh.onAfterRender = function(renderer, scene, camera, geometry, material, group ){
      mesh.portal.needUpdate = true
    }

    xrf.addEventListener('renderPost', (opts) => {
      if( mesh.portal && mesh.portal.needUpdate && mesh.portal.stencilObjects ){  
        let {scene,camera,time,render} = opts
        let stencilRef                 = mesh.portal.stencilRef
        let newPos                     = mesh.portal.posWorld
        let stencilObject              = mesh.portal.stencilObject
        let newScale                   = mesh.scale 
        let cameraDirection            = mesh.portal.cameraDirection
        let cameraPosition            = mesh.portal.cameraPosition
        let raycaster            = mesh.portal.raycaster

        // init
        if( !opts.isLocal ) stencilObject.visible = true 
        mesh.portal.stencilObjects.traverse( (n) => showPortal(n,false) && n.stencil && n.stencil(stencilRef,newPos,newScale) )
        renderer.autoClear             = false 
        renderer.clearDepth()
        // render
        render( mesh.portal.stencilObjects, camera )
        // de-init 
        mesh.portal.stencilObjects.traverse( (n) =>  showPortal(n,true) && n.stencil && (n.stencil(0)) )
        if( !opts.isLocal ) stencilObject.visible = false 


        // trigger href upon camera collide
        if( mesh.userData.XRF.href ){
          raycaster.far = 0.3
          let cam = xrf.camera.getCam ? xrf.camera.getCam() : camera
          cam.getWorldPosition(cameraPosition)
          cam.getWorldDirection(cameraDirection)
          raycaster.set(cameraPosition, cameraDirection )
          intersects = raycaster.intersectObjects([mesh], false)
          if (intersects.length > 0 && !mesh.portal.teleporting ){
            mesh.portal.teleporting = true
            mesh.userData.XRF.href.exec()
            setTimeout( () => mesh.portal.teleporting = false, 500) // dont flip back and forth
          }
        }

        mesh.portal.needUpdate = false
      }
    })
    return this
  }

  // turn mesh into stencilplane 
  xrf
  .portalNonEuclidian
  .setMaterial(mesh)
  .getWorldPosition(mesh.portal.posWorld)

  this
  .setupListeners()
  .setupStencilObjects(scene,opts)

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
  mesh.material.depthWrite   = false;
  mesh.material.depthTest    = false;
  mesh.material.colorWrite   = false;
  mesh.material.stencilWrite = true;
  mesh.material.stencilRef   = xrf.portalNonEuclidian.stencilRef;
  mesh.renderOrder           = xrf.portalNonEuclidian.stencilRef;
  mesh.material.stencilFunc  = THREE.AlwaysStencilFunc;
  mesh.material.stencilZPass = THREE.ReplaceStencilOp;
  //mesh.material.stencilFail  = THREE.ReplaceStencilOp;
  //mesh.material.stencilZFail = THREE.ReplaceStencilOp;
  return mesh
}


xrf.portalNonEuclidian.stencilRef = 1
