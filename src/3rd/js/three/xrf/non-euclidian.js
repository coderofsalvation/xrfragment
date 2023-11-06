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
    mesh.cam = xrf.camera.getCam().clone()
    mesh.cam.position.x = toFrag.pos.x
    mesh.cam.position.y = toFrag.pos.y + 1
    mesh.cam.position.z = toFrag.pos.z
    mesh.isStencil = true


    mesh.onBeforeRender = function( renderer, scene, camera, geometry, material, group ){
      xrf.scene.traverse( (n) => !n.isStencil && n.material ? n.material.stencilRef = this.material.stencilRef : false )
      xrf.renderer.render( xrf.scene, this.cam )
    }

    mesh.onAfterRender = function( renderer, scene, camera, geometry, material, group ){
      xrf.scene.traverse( (n) => !n.isStencil && n.material ? n.material.stencilRef = 0 : false )
    }

    xrf.portalNonEuclidian.stencilRef += 1 // each portal has unique stencil id
    // OBJECT INSIDE CUBE
    //objectMat.stencilWrite = true;
    //objectMat.stencilRef = stencilRef;
    //objectMat.stencilFunc = THREE.EqualStencilFunc;
    //const object = new THREE.Mesh(objectGeom, objectMat);
    //scene.add(object);
    console.log("enabling stencil plane")


}

xrf.portalNonEuclidian.stencilRef = 1
