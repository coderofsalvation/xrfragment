xrfragment.three.env = function(v, mesh, model, scene, renderer, THREE){
  let env = mesh.getObjectByName(v.string)
  env.material.map.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = env.material.map
  scene.texture = env.material.map
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
}
