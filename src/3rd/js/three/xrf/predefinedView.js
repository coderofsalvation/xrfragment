const doPredefinedView = (opts) => {
  let {frag,scene} = opts 

  const selectionOfInterest = (id,scene,mesh) => {
    // Selection of Interest if predefined_view matches object name
    if( mesh.selection ){
      scene.remove(mesh.selection)
      delete mesh.selection
    }
    if( id == mesh.name || id.substr(1) == mesh.userData.class ){
      xrf.emit('selection',opts)
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
  }

  const predefinedView = (frag,scene,mesh) => {
    let id  = frag.string
    if( mesh.userData[id] ){
      let frag = xrf.URI.parse( mesh.userData[id], xrf.XRF.NAVIGATOR | xrf.XRF.PV_OVERRIDE | xrf.XRF.EMBEDDED )
      for ( let k in frag ){
        let opts = {frag, model, camera: xrf.camera, scene: xrf.scene, renderer: xrf.renderer, THREE: xrf.THREE }
        xrf.emit('predefinedView',opts)
        .then( () => xrf.eval.fragment(k,opts) )
      }
    }
  }


  for ( let i in frag  ) {
    let v = frag[i]
    if( v.is( xrf.XRF.PV_EXECUTE ) ){
      if( v.args ) v = v.args[ xrf.roundrobin(v,xrf.model) ]
      // wait for nested instances to arrive at the scene 
      setTimeout( () => {
        if( !scene ) return 
        scene.traverse( (mesh) => {
          selectionOfInterest( v.string, scene, mesh )
          predefinedView( v , scene, mesh )
        })
      },100)
    }
  }
}

// when predefined view occurs in url changes
xrf.addEventListener('eval', doPredefinedView ) 

// clicking href url with predefined view 
xrf.addEventListener('href', (opts) => {
  if( !opts.click || opts.xrf.string[0] != '#' ) return 
  let frag = xrf.URI.parse( opts.xrf.string, xrf.XRF.NAVIGATOR | xrf.XRF.PV_OVERRIDE | xrf.XRF.EMBEDDED )
  doPredefinedView({frag,scene:xrf.scene})
}) 
