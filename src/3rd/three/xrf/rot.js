xrfragment.xrf.rot = function(v, opts){
  let { mesh, model, camera, scene, renderer, THREE} = opts
  camera.rotation.x = v.x * Math.PI / 180;
  camera.rotation.y = v.y * Math.PI / 180;
  camera.rotation.z = v.z * Math.PI / 180;
}
