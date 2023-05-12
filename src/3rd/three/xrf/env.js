xrf.frag.env = function(v, opts){
  let { mesh, model, camera, scene, renderer, THREE} = opts
  let env = mesh.getObjectByName(v.string)
  env.material.map.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = env.material.map
  //scene.texture = env.material.map    
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 2;
  // apply to meshes *DISABLED* renderer.environment does this
  const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
  setTimeout( () => {
    scene.traverse( (mesh) => {
      //if (mesh.material && mesh.material.map && mesh.material.metalness == 1.0) {
      //  mesh.material = new THREE.MeshBasicMaterial({ map: mesh.material.map });
      //  mesh.material.dithering = true
      //  mesh.material.map.anisotropy = maxAnisotropy;
      //  mesh.material.needsUpdate = true;
      //}
      //if (mesh.material && mesh.material.metalness == 1.0 ){
      //  mesh.material = new THREE.MeshBasicMaterial({
      //    color:0xffffff,
      //    emissive: mesh.material.map,
      //    envMap: env.material.map,
      //    side: THREE.DoubleSide,
      //    flatShading: true
      //  })
      //  mesh.material.needsUpdate = true
      //  //mesh.material.envMap = env.material.map;
      //  //mesh.material.envMap.intensity = 5;
      //  //mesh.material.needsUpdate = true;
      //}
    });
  },500)
  console.log(`   └ applied image '${v.string}' as environment map`)
}
