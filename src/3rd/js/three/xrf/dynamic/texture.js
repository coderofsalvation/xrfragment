xrf.addEventListener('dynamicKeyValue', (opts) => {
  let {scene,match,v} = opts
  let texture = v.fragment
  let found = false
  scene.traverse( (mesh) => {
    if( mesh.material && !found ){
      if( mesh.material.map && mesh.material.map.name == texture ){
        found = true
        let mat = mesh.material
        // remove render listener if any
        if( mesh.material.map.removeListener ) mesh.material.map.removeListener()

        if( v.x != undefined ){
          delete mesh.onBeforeRender
          mat.map.offset.x = v.x
          mat.map.offset.y = v.y
          mat.map.rotation = v.z
        }else{
          mesh.driver = xrf.model.animations.find( (a) => a.name == v.string )
          if( !mesh.driver ) return 
          let everyFrame = (mesh) => () => {
            let value = mesh.driver.action._propertyBindings[0].binding.resolvedProperty
            mesh.material.map.offset.x = value.x
            mesh.material.map.offset.y = value.y
            mesh.material.map.rotation = value.z
          }
          mesh.material.map.removeListener = xrf.addEventListener('render', everyFrame(mesh) )
        }
      }
    }
  })
})
