xrfragment.xrf.src = function(v, opts){
  let { mesh, model, camera, scene, renderer, THREE} = opts
  if( v.string[0] == "#" ){ // local 
    console.log("   └ instancing src")
    let args = xrfragment.URI.parse(v.string)
    // Get an instance of the original model
    const modelInstance = new THREE.Group();
    modelInstance.add(model.scene.clone());
    modelInstance.position.z = mesh.position.z
    modelInstance.position.y = mesh.position.y
    modelInstance.position.x = mesh.position.x
    modelInstance.scale.z = mesh.scale.x
    modelInstance.scale.y = mesh.scale.y
    modelInstance.scale.x = mesh.scale.z
    // now apply XR Fragments overrides from URI
    // *TODO* move to a central location (pull-up)
    for( var i in args ){
      if( i == "scale" ){
        console.log("   └ setting scale")
        modelInstance.scale.x = args[i].x
        modelInstance.scale.y = args[i].y
        modelInstance.scale.z = args[i].z
      }
    }
    // Add the instance to the scene
    scene.add(modelInstance);
    console.dir(model)
    console.dir(modelInstance)
  }
}
