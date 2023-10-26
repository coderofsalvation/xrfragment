xrf.addEventListener('dynamicKeyValue', (opts) => {
  let {scene,match,v} = opts
  let material = v.fragment

  const setMaterial = (mesh,v) => {
    let mat = mesh.material
    mat.transparent = v.x < 1.0 
    mat.opacity     = v.x 
  }
  console.dir(v)

  scene.traverse( (mesh) => {
    if( mesh.material){
      if( mesh.material && mesh.material.name == material ){
        delete mesh.onBeforeRender
        delete mesh.driver
        let opacity = v.float || v.x
        if( opacity != undefined ){
          setMaterial( mesh, {x:opacity})
        }else{
          mesh.driver = xrf.scene.getObjectByName(v.string)
          if( !mesh.driver ) return 
          mesh.onBeforeRender = function(){
            let model = xrf.model
            if( !model || !model.clock ) return
            setMaterial( this, this.driver.position )
          }
        }
      }
    }
  })
})
