xrf.frag.xywh = function(v, opts){
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts
  xrf.mediafragment.init(mesh)
  mesh.xywh.x = v.floats[0]
  mesh.xywh.y = v.floats[1] !== undefined ? v.floats[1] : mesh.xywh.x
  mesh.xywh.w = v.floats[2] !== undefined ? v.floats[2] : mesh.xywh.y
  mesh.xywh.h = v.floats[3] !== undefined ? v.floats[3] : mesh.xywh.w
  // TODO: nondestructive cropping of texture  (not superimportant now)
}
