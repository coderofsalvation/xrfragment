xrf.addEventListener('bg', (opts) => {
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts
  console.log("└ bg "+v.x+","+v.y+","+v.z);
  if( scene.background ) delete scene.background
  scene.background = new THREE.Color( v.x, v.y, v.z )
})
