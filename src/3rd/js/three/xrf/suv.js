xrf.frag.suv = function(v, opts){
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts

  if( !mesh.geometry ) return // nothing to do here

  xrf.frag.uv.init(mesh)
  mesh.suv.x    = v.x
  mesh.suv.y    = v.y !== undefined ? v.y : v.x
  mesh.suv.loop = v.loop === true ? true : false
  mesh.onBeforeRender = xrf.frag.uv.scroll
}
