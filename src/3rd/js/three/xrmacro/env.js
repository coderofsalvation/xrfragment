xrf.addEventListener('eval', (opts) => {
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts
  if( frag.env && !scene.environment ){
    let env = mesh.getObjectByName(frag.env.string)
    if( !env ) return console.warn("xrf.env "+v.string+" not found")
    env.material.map.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = env.material.map
    //scene.texture = env.material.map    
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 2;
    console.log(`   └ applied image '${frag.env.string}' as environment map`)
  }
})
