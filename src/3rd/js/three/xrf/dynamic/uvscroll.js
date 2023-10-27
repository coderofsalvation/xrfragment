xrf.addEventListener('dynamicKeyValue', (opts) => {
  let {scene,match,v} = opts
  let objname         = v.fragment

  scene.traverse( (mesh) => {
    if( mesh.name == objname ){
      if( !mesh.geometry ) return console.warn(`mesh '${objname}' has no uvcoordinates to offset`)
      let uv = mesh.geometry.getAttribute("uv")
      if( !uv.old ) uv.old = uv.clone()
      for( let i = 0; i < uv.count; i++ ){
        uv.setXY(i, uv.old.getX(i) + v.x, uv.old.getY(i) + v.y )
      }
      uv.needsUpdate = true
    }
  })
})
