// *TODO* use webgl instancing

xrf.frag.src = function(v, opts){
  let { mesh, model, camera, scene, renderer, THREE} = opts

  if( v.string[0] == "#" ){ // local 
    console.log("   └ instancing src")
    let frag = xrfragment.URI.parse(v.string)
    // Get an instance of the original model
    let sceneInstance   = new THREE.Group()
    sceneInstance.isSrc = true

    // prevent infinite recursion #1: skip src-instanced models
    for ( let i in model.scene.children ) {
      let child = model.scene.children[i]
      if( child.isSrc ) continue; 
      sceneInstance.add( model.scene.children[i].clone() )
    }

    sceneInstance.position.copy( mesh.position )
    sceneInstance.scale.copy(mesh.scale)
    sceneInstance.updateMatrixWorld(true)  // needed because we're going to move portals to the interactive-group
    
    // apply embedded XR fragments
    setTimeout( () => {
      sceneInstance.traverse( (m) => {
        if( m.userData && m.userData.src ) return ;//delete m.userData.src // prevent infinite recursion 
        xrf.eval.mesh(m,{scene,recursive:true}) 
      })
      // apply URI XR Fragments inside src-value 
      for( var i in frag ){
        xrf.eval.fragment(i, Object.assign(opts,{frag, model:{scene:sceneInstance},scene:sceneInstance}))
      }
      // Add the instance to the scene
      model.scene.add(sceneInstance);
    },10)
  }
}
