xrf.addEventListener('dynamicKey', (opts) => {
  let {scene,id,match,v} = opts
  if( !scene ) return 
  let remove = []
  // erase previous lines
  xrf.focusLine.lines.map( (line) => line.parent && (line.parent.remove(line))  )
  xrf.focusLine.points = []
  xrf.focusLine.lines  = []

  // drawlines
  match.map( (w) => {
    w.nodes.map( (mesh) => xrf.drawLineToMesh({ ...opts, mesh}) )
  })
})

xrf.drawLineToMesh = (opts) => {
  let {scene,mesh,frag,id} = opts
  const THREE = xrf.THREE
  let oldSelection
  // Selection of Interest if predefined_view matches object name
  if( mesh.visible && mesh.material){
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

      let cam = xrf.camera.getCam ? xrf.camera.getCam() : xrf.camera // *FIXME* camerarig/rig are conflicting
      cam.updateMatrixWorld(true); // always keeps me diving into the docs :]
      cam.getWorldPosition(from)
      from.y = 0.5 // originate from the heart chakra! :p
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

xrf.addEventListener('render', (opts) => {
  // update focusline 
  let {time,model} = opts
  if( !xrf.clock ) return 
  xrf.focusLine.material.color.r  = (1.0 + Math.sin( xrf.clock.getElapsedTime()*10  ))/2
  xrf.focusLine.material.dashSize = 0.2 + 0.02*Math.sin( xrf.clock.getElapsedTime()  )
  xrf.focusLine.material.gapSize  = 0.1 + 0.02*Math.sin( xrf.clock.getElapsedTime() *3  )
  xrf.focusLine.material.opacity  = (0.25 + 0.15*Math.sin( xrf.clock.getElapsedTime() * 3 )) * xrf.focusLine.opacity;
  if( xrf.focusLine.opacity > 0.0 ) xrf.focusLine.opacity -= time*0.2
  if( xrf.focusLine.opacity < 0.0 ) xrf.focusLine.opacity = 0
})
