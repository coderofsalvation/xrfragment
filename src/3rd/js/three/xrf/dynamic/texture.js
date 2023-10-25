xrf.addEventListener('dynamicKeyValue', (opts) => {
  let {scene,match,v} = opts
  let materialName = v.fragment
  scene.traverse( (mesh) => {
    if( mesh.material){
      if( mesh.material.map && mesh.material.name == materialName ){
        let mat = mesh.material
        if( v.x != undefined ){
          mat.map.offset.x = v.x
          mat.map.offset.y = v.y
          mat.map.rotation = v.z
        }else{
          let driver = xrf.scene.getObjectByName(v.string)
          if( !driver ) return 
          xrf.addEventListener('render', (opts) => {
            let model = xrf.model
            if( !model || !model.clock ) return
            mat.map.offset.x = driver.position.x
            mat.map.offset.y = driver.position.y
            mat.map.rotation = driver.position.z
          })
        }
      }
    }
  })
})
