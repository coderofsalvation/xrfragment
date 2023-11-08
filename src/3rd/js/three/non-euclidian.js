xrf.portalNonEuclidian = function(v, opts){
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts

    let toFrag = xrf.URI.parse( v.string )

    // turn plane into stencilplane 
    mesh.material = new THREE.MeshPhongMaterial({ color: 'green' });
    mesh.material.depthWrite   = false;
    mesh.material.stencilWrite = true;
    mesh.material.stencilRef   = xrf.portalNonEuclidian.stencilRef;
    mesh.material.stencilFunc  = THREE.AlwaysStencilFunc;
    mesh.material.stencilZPass = THREE.ReplaceStencilOp;
    //mesh.material.side         = THREE.DoubleSide (this requires flipping normals based on camerapos)
    mesh.stencilRef = xrf.portalNonEuclidian.stencilRef

    let stencilPos = new xrf.THREE.Vector3()
    mesh.getWorldPosition(stencilPos)

    // allow objects to flip between original and stencil position (which puts them behind stencilplane)
    const addStencilFeature = (n) => { 
      n.stencil = (
        (pos,stencilPos, stencilMaterial, material ) => (enabled) => {
          if( mesh.stencilScene.active ) enabled = false // always deactive when stencil was clicked 
          let sRef          = enabled ? mesh.stencilRef : 0
          n.position.copy( enabled ? stencilPos : pos )
          xrf.portalNonEuclidian.selectStencil(n, sRef )
          n.traverse( (c) => xrf.portalNonEuclidian.selectStencil(c,sRef) )
        }
      )( n.position.clone(), stencilPos, n.material.clone, n.material )
      return n
    }

    // collect related objects from XRWG to render inside stencilplane
    let objs = XRWG.match(mesh.name,0)
    if( objs.length == 0 ) return console.warn(`no objects are tagged with (portal)object name '${mesh.name}'`)
    objs = objs[0].nodes 
                  .filter( (n) => n.uuid != mesh.uuid && !n.stencilRef ) // filter out stencilplane
                  .map(addStencilFeature)

    // put it into a scene so we can render it separately
    mesh.stencilScene = new xrf.THREE.Scene()
    mesh.stencilScene.children = objs
    
    // enable the stencil-material of the stencil objects 
    mesh.onAfterRender = function(){
      mesh.stencilScene.traverse( (n) => n.stencil ? n.stencil(true) : false )
    }

    xrf.addEventListener('href', (opts) => {
      if( opts.click && opts.mesh.uuid == mesh.uuid){
        // reposition stencilScene objects back to their original (and disable the stencil material)
        mesh.stencilScene.traverse( (n) => n.stencil ? n.stencil(false) : false )
        mesh.stencilScene.active = true 
      }else mesh.stencilScene.active = false
    })

    xrf.portalNonEuclidian.stencilRef += 1 // each portal has unique stencil id
    console.log("enabling portal for object '${mesh.name}'`")
}

xrf.portalNonEuclidian.selectStencil = (n, stencilRef, material) => {
  if( n.material ){
    if( !n.stencilMaterial ){
      n.originalMaterial = n.material
      n.stencilMaterial  = n.material.clone()
      n.stencilMaterial.stencilRef = stencilRef 
      n.stencilMaterial.stencilWrite = stencilRef 
      n.stencilMaterial.stencilFunc = xrf.THREE.EqualStencilFunc;
    }
    n.material = stencilRef > 0 ? n.stencilMaterial : n.originalMaterial
  }
}

xrf.portalNonEuclidian.stencilRef = 1
