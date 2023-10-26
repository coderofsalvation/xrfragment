xrf.addEventListener('dynamicKeyValue', (opts) => {
  let {scene,match,v} = opts
  let light = v.fragment
  scene.traverse( (o) => {
    if( o.isLight && o.name == light ){
      if( v.x != undefined ){
        o.color.r = v.x
        o.color.g = v.y
        o.color.b = v.z
        console.dir(o)
      }else{
        let driver = xrf.scene.getObjectByName(v.string)
        if( !driver ) return 
        o.onAfterRender = () => {
          let model = xrf.model
          if( !model || !model.clock ) return
          o.color.r = v.x
          o.color.g = v.y
          o.color.b = v.z
        }
      }
    }
  })
})
