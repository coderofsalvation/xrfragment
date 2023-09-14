xrf.frag.defaultPredefinedView = (opts) => {
  let {scene,model} = opts;
  let frag = {}
  xrf.Parser.parse("#","",frag)
  xrf.frag.updatePredefinedView({frag,model,scene})
}

xrf.frag.updatePredefinedView = (opts) => {
  let {frag,scene,model} = opts 

  // spec: https://xrfragment.org/#Selection%20of%20interest
  const selectionOfInterest = (frag,scene,mesh) => {
    let id = frag.string
    let oldSelection
    if(!id) return id // important: ignore empty strings 
    if( mesh.selection ) oldSelection = mesh.selection 
    // Selection of Interest if predefined_view matches object name
    if( mesh.visible && (id == mesh.name || id.substr(1) == mesh.userData.class) ){
      xrf.emit('selection',{...opts,frag})
      .then( () => {
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

  // spec: https://xrfragment.org/#predefined_view
  const predefinedView = (frag,scene,mesh) => {
    let id   = frag.string || frag.fragment
    id       = `#${id}`
    if( id == '##' ) id = '#'; // default predefined view
    if( !id ) return           // prevent empty matches
    if( mesh.userData[id] ){   // get alias
      frag = xrf.URI.parse( mesh.userData[id], xrf.XRF.NAVIGATOR | xrf.XRF.PV_OVERRIDE | xrf.XRF.METADATA )
      xrf.emit('predefinedView',{...opts,frag})
      .then( () => {
        for ( let k in frag ){
          let opts = {frag, model, camera: xrf.camera, scene: xrf.scene, renderer: xrf.renderer, THREE: xrf.THREE }
          if( frag[k].is( xrf.XRF.PV_EXECUTE ) && scene.XRF_PV_ORIGIN != k ){  // cyclic detection
            traverseScene(frag[k],scene)                                       // recurse predefined views
          }
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

  // if this query was triggered by an src-value, lets filter it
  const isSRC = opts.embedded && opts.embedded.fragment == 'src'
  if( isSRC ){                             // spec : https://xrfragment.org/#src
    console.log("filtering predefined view of src")
    console.dir(frag)
  }else{
    for ( let i in frag  ) {
      let v = frag[i]
      if( v.is( xrf.XRF.PV_EXECUTE ) ){
        scene.XRF_PV_ORIGIN = v.string
        // wait for nested instances to arrive at the scene ?
        traverseScene(v,scene)
      }
    }
  }
}

// react to url changes 
xrf.addEventListener('updateHash', (opts) => {
  let frag = xrf.URI.parse( opts.hash, xrf.XRF.NAVIGATOR | xrf.XRF.PV_OVERRIDE | xrf.XRF.METADATA )
  xrf.frag.updatePredefinedView({frag,scene:xrf.scene})
}) 

// clicking href url with predefined view 
xrf.addEventListener('href', (opts) => {
  if( !opts.click || opts.xrf.string[0] != '#' ) return 
  let frag = xrf.URI.parse( opts.xrf.string, xrf.XRF.NAVIGATOR | xrf.XRF.PV_OVERRIDE | xrf.XRF.METADATA )
  xrf.frag.updatePredefinedView({frag,scene:xrf.scene,href:opts.xrf})
}) 

//let updateUrl = (opts) => {
//  console.dir(opts)
//}
//
//xrf.addEventListener('predefinedView', updateUrl )
//xrf.addEventListener('selection', updateUrl )
