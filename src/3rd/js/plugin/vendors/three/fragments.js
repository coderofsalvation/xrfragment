xrf.frag.clip = function(v, opts){
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts

  if( v.x == 0 ) v.x = 1;  // THREE.js .near restriction
  console.log("└ clip "+v.x+","+v.y);

  camera.near = v.x
  camera.far  = v.y
  camera.updateProjectionMatrix();
}
