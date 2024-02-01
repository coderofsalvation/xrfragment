xrf.mediafragment = {}

xrf.mediafragment.uvscroll = function(mesh,v){
  let uv = mesh.geometry.getAttribute("uv")
  if( !uv.old ) uv.old = uv.clone()

  for( let i = 0; i < uv.count; i++ ){
    uv.setXY(i, uv.old.getX(i) + v.x, uv.old.getY(i) + v.y )
  }

  if( v.speed.length ){
    if( mesh.removeUVListener ) mesh.removeUVListener()
    mesh.removeUVListener = xrf.addEventListener('render', (opts) => {
      let {time} = opts
      let speedx = v.speed[0]
      let speedy = v.speed.length > 1 ? v.speed[1] : 0;
      for( let i = 0; i < uv.count; i++ ){
        uv.setXY(i, uv.getX(i) + speedx * time, uv.getY(i) + speedy * time)
      }
      uv.needsUpdate = true
    })
  }
  uv.needsUpdate = true
}

xrf.addEventListener('dynamicKeyValue', (opts) => {
  let {scene,match,v} = opts
  if( !v.is( xrf.XRF.T_DYNAMIC ) || v.fragment[0] == '-' ) return 
  let objname         = v.fragment

  scene.traverse( (mesh) => {
    if( mesh.name == objname ){
      if( mesh.video    ) return mesh.video.playXRF(v) 
      //if( mesh.geometry ) return xrf.mediafragment.uvscroll(mesh,v)
    }
  })
})
