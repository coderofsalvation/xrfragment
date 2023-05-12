// *TODO* use webgl instancing

xrf.frag.src = function(v, opts){
  let { mesh, model, camera, scene, renderer, THREE} = opts
  if( v.string[0] == "#" ){ // local 
    console.log("   └ instancing src")
    let frag = xrfragment.URI.parse(v.string)
    // Get an instance of the original model
    const modelInstance = new THREE.Group();
    let sceneInstance   = model.scene.clone()
    modelInstance.add(sceneInstance)
    modelInstance.position.z = mesh.position.z
    modelInstance.position.y = mesh.position.y
    modelInstance.position.x = mesh.position.x
    modelInstance.scale.z = mesh.scale.x
    modelInstance.scale.y = mesh.scale.y
    modelInstance.scale.x = mesh.scale.z
    // now apply XR Fragments overrides from URI
    for( var i in frag )
      xrf.eval.fragment(i, Object.assign(opts,{frag, model:modelInstance,scene:sceneInstance}))
    // Add the instance to the scene
    model.scene.add(modelInstance);
  }
}
