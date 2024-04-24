xrf.addEventListener('-three-fog', (opts) => {
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts
  let v = frag.fog
  console.log("└ threejs fog "+v.x+","+v.y);
  if( v.x == 0 && v.y == 0 ){  
    if( scene.fog ) delete scene.fog
    scene.fog = null;
  }else scene.fog = new THREE.Fog( scene.background, v.x, v.y );
})

xrf.addEventListener('bg', (opts) => {
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts
  console.log("└ bg "+v.x+","+v.y+","+v.z);
  if( scene.background ) delete scene.background
  scene.background = new THREE.Color( v.x, v.y, v.z )
})
