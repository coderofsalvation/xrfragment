xrf.frag.pos = function(v, opts){
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts

  let pos = v

  // spec: indirect coordinate using objectname: https://xrfragment.org/#navigating%203D
  if( pos.x == undefined ){
    let obj = scene.getObjectByName(v.string)
    if( !obj ) return 
    pos = obj.position.clone()
    obj.getWorldPosition(pos)
    camera.position.copy(pos)
  }else{ 
    // spec: direct coordinate: https://xrfragment.org/#navigating%203D
    camera.position.x = pos.x
    camera.position.y = pos.y
    camera.position.z = pos.z
  }

  if( xrf.debug ) console.log(`#pos.js: setting camera to position ${pos.x},${pos.y},${pos.z}`)

  xrf.frag.pos.last = v.string // remember
  xrf.frag.pos.lastVector3 = camera.position.clone()

  camera.updateMatrixWorld()
}

xrf.frag.pos.get = function(precision,randomize){
    if( !precision ) precision = 2;
    if( typeof THREE == 'undefined' ) THREE = xrf.THREE
    let radToDeg  = THREE.MathUtils.radToDeg
    let toDeg     = (x) => x / (Math.PI / 180)
    let camera    = xrf.camera 
    if( randomize ){
      camera.position.x += Math.random()/10
      camera.position.z += Math.random()/10
    }

    // *TODO* add camera direction
    let direction = new xrf.THREE.Vector3()
    camera.getWorldDirection(direction)
    const pitch   = Math.asin(direction.y);
    const yaw     = Math.atan2(direction.x, direction.z);
    const pitchInDegrees = pitch * 180 / Math.PI;
    const yawInDegrees = yaw * 180 / Math.PI;

    return {
      x: String(camera.position.x.toFixed(2)),
      y: String(camera.position.y.toFixed(2)),
      z: String(camera.position.z.toFixed(2)),
    }
}

xrf.addEventListener('reset', (opts) => {
  // set the player to position 0,0,0
  xrf.camera.position.set(0,0,0)
})
