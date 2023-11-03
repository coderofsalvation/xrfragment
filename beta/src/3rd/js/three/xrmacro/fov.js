xrf.frag.fov = function(v, opts){
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts

  console.log("└ fov "+v.int);
  camera.fov = v.int;
  camera.updateProjectionMatrix();
}
