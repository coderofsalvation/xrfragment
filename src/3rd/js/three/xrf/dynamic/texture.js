xrf.addEventListener('dynamicKeyValue', (opts) => {
  let {scene,match,v} = opts
  let texture = v.fragment
  scene.traverse( (mesh) => {
    if( mesh.material){
      if( mesh.material.map && mesh.material.map.name == texture ){
        let mat = mesh.material
        delete mesh.onBeforeRender
        delete mesh.driver
        if( v.x != undefined ){
          mat.map.offset.x = v.x
          mat.map.offset.y = v.y
          mat.map.rotation = v.z
        }else{
          mesh.driver = xrf.scene.getObjectByName(v.string)
          if( !mesh.driver ) return 
          mesh.onBeforeRender = function(){
            let model = xrf.model
            if( !model || !model.clock ) return
            this.material.map.offset.x = this.driver.position.x
            this.material.map.offset.y = this.driver.position.y
            this.material.map.rotation = this.driver.position.z
          }
        }
      }
    }
  })
})
