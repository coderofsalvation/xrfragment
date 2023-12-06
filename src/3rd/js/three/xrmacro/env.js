xrf.addEventListener('env', (opts) => {
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts
  if( frag.env && !scene.environment ){
    //let env = scene.getObjectByName(frag.env.string)
    //if( !env ) env = xrf.scene.getObjectByName(frag.env.string) // repurpose from parent scene
    //if( !env ) return console.warn("xrf.env "+frag.env.string+" not found")
    //env.material.map.mapping = THREE.EquirectangularReflectionMapping;
    //scene.environment = env.material.map
    //scene.texture = env.material.map    
 //   renderer.toneMapping = THREE.ACESFilmicToneMapping;
 //   renderer.toneMappingExposure = 2;
    console.log(`   └ applied image '${frag.env.string}' as environment map`)
  }

})
