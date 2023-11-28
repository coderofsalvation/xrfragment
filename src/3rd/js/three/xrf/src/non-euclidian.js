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
    raycaster: new THREE.Raycaster(),
    isLocal: opts.isLocal,
    isLens: false
  }

  // allow objects to flip between original and stencil position (which puts them behind stencilplane)
  const addStencilFeature = (n) => { 
    if( n.stencil ) return n // run once
    n.stencil = ( (pos,scale) => (sRef,newPos, newScale) => {
        if( !mesh.portal.isLens ){
          n.position.copy( sRef == 0 ? pos   : newPos )
          if( sRef > 0 ) n.scale.multiply( newScale )
          else           n.scale.copy( scale )
          n.updateMatrixWorld(true)
        }
        xrf.portalNonEuclidian.selectStencil(n, sRef )
      }
    )( n.position.clone(), n.scale.clone() )
    return n
  }

  this.setupStencilObjects = (scene,opts) => {
    // collect related objects to render inside stencilplane
    let stencilObject         = scene 
    if( opts.srcFrag.target ){
      stencilObject = scene.getObjectByName( opts.srcFrag.target.key ) 
      // spec: if src-object is child of portal (then portal is lens, and should include all children )
      mesh.traverse( (n) => n.name == opts.srcFrag.target.key && (stencilObject = n) && (mesh.portal.isLens = true) ) 
    }
    if( !stencilObject ) return console.warn(`no objects were found (src:${mesh.userData.src}) for (portal)object name '${mesh.name}'`)
    mesh.portal.stencilObject = stencilObject 

    // spec: if src points to child, act as lens
    if( !mesh.portal.isLocal || mesh.portal.isLens )  stencilObject.visible = false 

    let stencilObjects = [stencilObject]
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

    xrf.portalNonEuclidian.stencilRef += 1 // each portal has unique stencil id
    console.log(`enabling portal for object '${mesh.name}' (stencilRef:${mesh.portal.stencilRef})`)

    // clone so it won't be affected by other fragments
    setTimeout( (mesh) => {
      if( mesh.material ) mesh.material = mesh.material.clone() // clone, so we can individually highlight meshes
    }, 0, mesh )
  
    
    // spec: increase height of portal(object) floor so it won't get rendererd under the current floor
    mesh.portal.posWorld.y +=0.1

    return this
  }

  // enable the stencil-material of the stencil objects to prevent stackoverflow (portal in portal rendering)
  const showPortal = (n,show) => {
    if( n.portal ) n.visible = show
    return true
  }

  this.setupListeners = () => {

    mesh.onAfterRender = function(renderer, scene, camera, geometry, material, group ){
      if( mesh.portal && mesh.portal.stencilObjects ){  
        let stencilRef                 = mesh.portal.stencilRef
        let newPos                     = mesh.portal.posWorld
        let stencilObject              = mesh.portal.stencilObject
        let newScale                   = mesh.scale 
        let cameraDirection            = mesh.portal.cameraDirection
        let cameraPosition             = mesh.portal.cameraPosition
        let raycaster                  = mesh.portal.raycaster
        let cam = xrf.camera.getCam ? xrf.camera.getCam() : camera
        cam.getWorldPosition(cameraPosition)
        if( cameraPosition.distanceTo(newPos) > 20.0 ) return // dont render far portals 
        cam.getWorldDirection(cameraDirection)

        // init
        if( !mesh.portal.isLocal || mesh.portal.isLens ) stencilObject.visible = true 
        mesh.portal.stencilObjects.traverse( (n) => showPortal(n,false) && n.stencil && n.stencil(stencilRef,newPos,newScale) )
        renderer.autoClear             = false 
        // render
        renderer.render( mesh.portal.stencilObjects, camera )
        // de-init 
        mesh.portal.stencilObjects.traverse( (n) =>  showPortal(n,true) && n.stencil && (n.stencil(0)) )
        if( !mesh.portal.isLocal || mesh.portal.isLens ) stencilObject.visible = false 


        // trigger href upon camera collide
        if( mesh.userData.XRF.href ){
          raycaster.far = 0.35
          raycaster.set(cameraPosition, cameraDirection )
          intersects = raycaster.intersectObjects([mesh], false)
          if (intersects.length > 0 && !mesh.portal.teleporting ){
            mesh.portal.teleporting = true
            mesh.userData.XRF.href.exec({nocommit:true})
            setTimeout( () => mesh.portal.teleporting = false, 500) // dont flip back and forth
          }
        }
      }
    }
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
  mesh.material = new xrf.THREE.MeshBasicMaterial({ color: 'orange' });
  mesh.material.depthWrite   = false;
  mesh.material.colorWrite   = false;
  mesh.material.stencilWrite = true;
  mesh.material.stencilRef   = xrf.portalNonEuclidian.stencilRef;
  mesh.renderOrder           = 10;//xrf.portalNonEuclidian.stencilRef;
  mesh.material.stencilFunc  = xrf.THREE.AlwaysStencilFunc;
  mesh.material.stencilZPass = xrf.THREE.ReplaceStencilOp;
  mesh.material.stencilZFail = xrf.THREE.ReplaceStencilOp;
    //n.material.depthFunc    = stencilRef > 0 ? xrf.THREE.AlwaysDepth : xrf.THREE.LessEqualDepth
  //mesh.material.depthTest    = false;
  return mesh
}

xrf.addEventListener('parseModel',(opts) => {
  const scene = opts.model.scene
  scene.traverse( (n) => n.renderOrder = 0 ) // rendering everything *after* the stencil buffers
})


xrf.portalNonEuclidian.stencilRef = 1
