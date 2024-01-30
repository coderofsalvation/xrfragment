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
    cameraDirection: new xrf.THREE.Vector3(),
    cameraPosition: new xrf.THREE.Vector3(),
    raycaster: new xrf.THREE.Raycaster(),
    isLocal: opts.isLocal,
    isLens: false,
    isInside: false,
    setStencil:  (stencilRef) => mesh.portal.stencilObjects.traverse( (n) => showPortal(n, stencilRef == 0) && n.stencil && n.stencil(stencilRef) ),
    positionObjectsIfNeeded: (pos,scale)  => !mesh.portal.isLens &&  mesh.portal.stencilObjects.traverse( (n) =>  n.positionAtStencil && (n.positionAtStencil(pos,scale)) )
  }

  // allow objects to flip between original and stencil position (which puts them behind stencilplane)
  const addStencilFeature = (n) => { 
    if( n.stencil ) return n // run once

    n.stencil = (sRef ) => xrf.portalNonEuclidian.selectStencil(n, sRef )
    n.positionAtStencil = (pos,scale) => (newPos,newScale) => {
      n.position.copy( newPos || pos )
      n.scale.copy( scale )
      n.updateMatrixWorld(true)
    }
    // curry function 
    n.positionAtStencil = n.positionAtStencil( n.position.clone(), n.scale.clone() )
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

    // put it into a scene (without .add() because it reparents objects) so we can render it separately
    mesh.portal.stencilObjects = new xrf.THREE.Scene()
    mesh.portal.stencilObjects.children = stencilObjects 

    xrf.portalNonEuclidian.stencilRef += 1 // each portal has unique stencil id
    console.log(`enabling portal for object '${mesh.name}' (stencilRef:${mesh.portal.stencilRef})`)
  
    return this
  }

  // enable the stencil-material of the stencil objects to prevent stackoverflow (portal in portal rendering)
  const showPortal = (n,show) => {
    if( n.portal ) n.visible = show
    return true
  }

  this.setupListeners = () => {

    mesh.onAfterRender = function(renderer, scene, camera, geometry, material, group ){
      mesh.portal.needUpdate = true
    }

    xrf.addEventListener('renderPost', (opts) => {
      let {scene,camera,time,render,renderer} = opts

      if( mesh.portal.needUpdate && mesh.portal && mesh.portal.stencilObjects ){  
        let cameraDirection            = mesh.portal.cameraDirection
        let cameraPosition             = mesh.portal.cameraPosition
        let stencilRef                 = mesh.portal.stencilRef
        let newPos                     = mesh.portal.posWorld
        let stencilObject              = mesh.portal.stencilObject
        let newScale                   = mesh.scale 
        let raycaster                  = mesh.portal.raycaster

        let cam = xrf.camera.getCam ? xrf.camera.getCam() : camera
        cam.getWorldPosition(cameraPosition)
        cam.getWorldDirection(cameraDirection)
        if( cameraPosition.distanceTo(newPos) > 10.0 ) return // dont render far portals 

        // init
        if( !mesh.portal.isLocal || mesh.portal.isLens ) stencilObject.visible = true 
        mesh.portal.setStencil(stencilRef)
        renderer.autoClear             = false 
        renderer.autoClearDepth        = false 
        renderer.autoClearColor        = false 
        renderer.autoClearStencil      = false 
        // render
        render( mesh.portal.stencilObjects, camera )
        // de-init 
        renderer.autoClear             = true 
        renderer.autoClearDepth        = true 
        renderer.autoClearColor        = true 
        renderer.autoClearStencil      = true 
        mesh.portal.setStencil(0)
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
      mesh.portal.needUpdate = false
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

  // move portal objects to portalposition
  if( mesh.portal.stencilObjects ) mesh.portal.positionObjectsIfNeeded(mesh.portal.posWorld, mesh.scale)
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
 // mesh.renderOrder           = 0;//xrf.portalNonEuclidian.stencilRef;
  mesh.material.stencilFunc  = xrf.THREE.AlwaysStencilFunc;
  mesh.material.stencilZPass = xrf.THREE.ReplaceStencilOp;
  mesh.material.stencilZFail = xrf.THREE.ReplaceStencilOp;
    //n.material.depthFunc    = stencilRef > 0 ? xrf.THREE.AlwaysDepth : xrf.THREE.LessEqualDepth
  //mesh.material.depthTest    = false;
  return mesh
}

xrf.addEventListener('parseModel',(opts) => {
  const scene = opts.model.scene
  //for( let i in scene.children ) scene.children[i].renderOrder = 10 // render outer layers last (worldspheres e.g.)
})


// (re)set portalObjects when entering/leaving a portal 
let updatePortals = (opts) => {
  xrf.scene.traverse( (n) => {
    if( !n.portal ) return 
    // move objects back to the portal 
    if( n.portal.isInside ) n.portal.positionObjectsIfNeeded( n.portal.posWorld, n.scale )
    n.portal.isInside = false
  })
  if( opts.mesh && opts.mesh.portal && opts.click ){
    opts.mesh.portal.isInside = true
    opts.mesh.portal.positionObjectsIfNeeded() // move objects back to original pos (since we are teleporting there)
  }
}

xrf.addEventListener('href', (opts) => opts.click && updatePortals(opts) )
xrf.addEventListener('navigate', updatePortals )

xrf.portalNonEuclidian.stencilRef = 1
