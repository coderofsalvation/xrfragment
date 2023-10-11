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
    // Selection of Interest if predefined_view matches object name
    if( mesh.visible ){
      xrf.emit('focus',{...opts,frag})
      .then( () => {
        const color    = new THREE.Color();
        const colors   = []
        let from       = new THREE.Vector3()

        let getCenterPoint = (mesh) => {
            var geometry = mesh.geometry;
            geometry.computeBoundingBox();
            var center = new THREE.Vector3();
            geometry.boundingBox.getCenter( center );
            mesh.localToWorld( center );
            return center;
        }         

        xrf.camera.updateMatrixWorld(true); // always keeps me diving into the docs :]
        xrf.camera.getWorldPosition(from)
        from.y -= 0.5 // originate from the heart chakra! :p
        const points = [from, getCenterPoint(mesh) ]
        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        let line = new THREE.Line( geometry, xrf.focusLine.material );
        line.isXRF = true
        line.computeLineDistances();
        xrf.focusLine.lines.push(line)
        xrf.focusLine.points.push(from)
        xrf.focusLine.opacity = 1
        scene.add(line)
      })
    }
  }

  //// spec: https://xrfragment.org/#predefined_view
  //const predefinedView = (frag,scene,mesh) => {
  //  let id   = frag.string || frag.fragment
  //  id       = `#${id}`
  //  if( id == '##' ) id = '#'; // default predefined view
  //  if( !id ) return           // prevent empty matches
  //  if( mesh.userData[id] ){   // get alias
  //    frag = xrf.URI.parse( mesh.userData[id], xrf.XRF.NAVIGATOR | xrf.XRF.PV_OVERRIDE | xrf.XRF.METADATA )
  //    xrf.emit('predefinedView',{...opts,frag})
  //    .then( () => {
  //      for ( let k in frag ){
  //        let opts = {frag, model, camera: xrf.camera, scene: xrf.scene, renderer: xrf.renderer, THREE: xrf.THREE }
  //        if( frag[k].is( xrf.XRF.PV_EXECUTE ) && scene.XRF_PV_ORIGIN != k ){  // cyclic detection
  //          highlightInScene(frag[k],scene)                                    // recurse predefined views
  //        }
  //      }
  //    })
  //  }
  //}

  const highlightInScene = (v,scene) => {
    if( !scene ) return 
    let remove = []
    let id = v.string || v.fragment
    if( id == '#' ) return
    let match = xrf.XRWG.match(id)
    console.dir({id,match,XRWG:xrf.XRWG})
    // erase previous lines
    xrf.focusLine.lines.map( (line) => scene.remove(line) )
    xrf.focusLine.points = []
    xrf.focusLine.lines  = []

    scene.traverse( (n) => n.selection ? remove.push(n) : false )
    remove.map(     (n) => scene.remove(n.selection) )
    // create new selections
    match.map( (w) => {
      if( w.key == `#${id}` && w.value && w.value[0] == '#' ){
        // if value is alias, execute fragment value 
        xrf.hashbus.pub( w.value, xrf.model, xrf.XRF.METADATA | xrf.XRF.PV_OVERRIDE | xrf.XRF.NAVIGATOR )
      }
      w.nodes.map( (mesh) => {
        if( mesh.material )
          selectionOfInterest( v, scene, mesh )
      })
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
        highlightInScene(v,scene)
      }
    }
  }
}

// react to enduser typing url
xrf.addEventListener('hash', (opts) => {
  let frag = xrf.URI.parse( opts.hash, xrf.XRF.NAVIGATOR | xrf.XRF.PV_OVERRIDE | xrf.XRF.METADATA )
  console.dir({opts,frag})
  xrf.frag.updatePredefinedView({frag,scene:xrf.scene})
}) 

// clicking href url with predefined view 
xrf.addEventListener('href', (opts) => {
  if( !opts.click || opts.xrf.string[0] != '#' ) return 
  let frag = xrf.URI.parse( opts.xrf.string, xrf.XRF.NAVIGATOR | xrf.XRF.PV_OVERRIDE | xrf.XRF.METADATA )
  xrf.frag.updatePredefinedView({frag,scene:xrf.scene,href:opts.xrf})
}) 
