xrf.addEventListener('fog', (opts) => {
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts
  let v = frag.fog
  console.log("└ fog "+v.x+","+v.y);
  if( v.x == 0 && v.y == 0 ){  
    if( scene.fog ) delete scene.fog
    scene.fog = null;
  }else scene.fog = new THREE.Fog( scene.background, v.x, v.y );
})
