const updatePredefinedView = (opts) => {
  let {frag,scene} = opts 

  const selectionOfInterest = (frag,scene,mesh) => {
    let id = frag.string
    let oldSelection
    if(!id) return id // important: ignore empty strings 
    if( mesh.selection ) oldSelection = mesh.selection 
    // Selection of Interest if predefined_view matches object name
    if( mesh.visible && (id == mesh.name || id.substr(1) == mesh.userData.class) ){
      xrf.emit('selection',{...opts,frag})
      .then( () => {
        console.log("selection event")
        const margin = 1.2
        mesh.scale.multiplyScalar( margin )
        mesh.selection = new xrf.THREE.BoxHelper(mesh,0xff00ff)
        mesh.scale.divideScalar( margin )
        mesh.selection.material.dispose()
        mesh.selection.material = xrf.navigator.material.selection
        mesh.selection.isXRF = true
        scene.add(mesh.selection)
      })
    }
    return oldSelection
  }

  const predefinedView = (frag,scene,mesh) => {
    let id   = frag.string
    if( !id ) return  // prevent empty matches
    if( mesh.userData[`#${id}`] ){ // get alias
      frag = xrf.URI.parse( mesh.userData[`#${id}`], xrf.XRF.NAVIGATOR | xrf.XRF.PV_OVERRIDE | xrf.XRF.EMBEDDED )
      xrf.emit('predefinedView',{...opts,frag})
      .then( () => {
        for ( let k in frag ){
          let opts = {frag, model, camera: xrf.camera, scene: xrf.scene, renderer: xrf.renderer, THREE: xrf.THREE }
          xrf.eval.fragment(k,opts) 
        }
      })
    }
  }

  const traverseScene = (v,scene) => {
    let remove = []
    if( !scene ) return 
    scene.traverse( (mesh) => {
      remove.push( selectionOfInterest( v, scene, mesh ) )
      predefinedView( v , scene, mesh )
    })
    remove.filter( (e) => e ).map( (selection) => {
      scene.remove(selection)
    })
  }

  let pviews = []
  for ( let i in frag  ) {
    let v = frag[i]
    if( v.is( xrf.XRF.PV_EXECUTE ) ){
      if( v.args ) v = v.args[ xrf.roundrobin(v,xrf.model) ]
      // wait for nested instances to arrive at the scene 
      setTimeout( () => traverseScene(v,scene), 100 )
      console.dir(v)
      if( v.string ) pviews.push(v.string)
    }else if( v.is( xrf.XRF.NAVIGATOR ) ) pviews.push(`${i}=${v.string}`)
  }
  if( pviews.length ) xrf.navigator.updateHash( pviews.join("&") )
}

// when predefined view occurs in url changes
xrf.addEventListener('eval', updatePredefinedView ) 

// clicking href url with predefined view 
xrf.addEventListener('href', (opts) => {
  if( !opts.click || opts.xrf.string[0] != '#' ) return 
  let frag = xrf.URI.parse( opts.xrf.string, xrf.XRF.NAVIGATOR | xrf.XRF.PV_OVERRIDE | xrf.XRF.EMBEDDED )
  updatePredefinedView({frag,scene:xrf.scene,href:opts.xrf})
}) 

//let updateUrl = (opts) => {
//  console.dir(opts)
//}
//
//xrf.addEventListener('predefinedView', updateUrl )
//xrf.addEventListener('selection', updateUrl )
