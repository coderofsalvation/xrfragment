xrf.addEventListener('dynamicKeyValue', (opts) => {
  let {scene,match,v} = opts
  let objname         = v.fragment
  let autoscroll      = v.z > 0 || v.w > 0 

  scene.traverse( (mesh) => {
    if( mesh.name == objname ){
      if( !mesh.geometry ) return console.warn(`mesh '${objname}' has no uvcoordinates to offset`)
      let uv = mesh.geometry.getAttribute("uv")
      if( !uv.old ) uv.old = uv.clone()

      for( let i = 0; i < uv.count; i++ ){
        uv.setXY(i, uv.old.getX(i) + v.x, uv.old.getY(i) + v.y )
      }

      if( autoscroll ){
        if( mesh.removeUVListener ) mesh.removeUVListener()
        mesh.removeUVListener = xrf.addEventListener('render', (opts) => {
          let {time} = opts
          for( let i = 0; i < uv.count; i++ ){
            uv.setXY(i, uv.getX(i) + v.z * time, uv.getY(i) + v.w * time)
          }
          uv.needsUpdate = true
        })
      }
      
      uv.needsUpdate = true
    }
  })
})
