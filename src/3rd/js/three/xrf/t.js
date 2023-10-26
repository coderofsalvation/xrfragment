xrf.frag.t = function(v, opts){
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts
  console.log(`   └ setting animation loop to ${v.x} ${v.y} ${v.z}` )
  if( !model.animations || model.animations[0] == undefined ) return console.warn('no animation in scene')

  model.mixer.t = v
  let mixer     = model.mixer
  xrf.frag.t.calculateLoop( v, mixer.loop, mixer.loop.fps )
  
  // update speed
  mixer.timeScale = mixer.loop.speed

  let updateTime = (time) => {
    mixer.setTime(time)
    mixer.time = Math.abs(mixer.time)
    mixer.update(0)      // (forgetting) this little buddy costed me lots of time :]
    xrf.model.animations.map( (anim) => { 
      anim.action.setLoop( v.z == 0 ? THREE.LoopOnce : THREE.LoopRepeat)
    })
  }

  // play animations
  mixer.play( v.x == 1 )

  if( v.y > 0 || v.z > 0 ) updateTime( mixer.loop.timeStart )

  // update loop when needed 
  if( !mixer.update.patched ){
    let update = mixer.update
    mixer.update = function(time){
      mixer.time = Math.abs(mixer.time)
      if( time == 0 ) return update.call(mixer,time)

      if( mixer.loop.speed > 0.0 && mixer.time > mixer.loop.timeStop * mixer.loop.speedAbs ){ 
        setTimeout( (time) => updateTime(time),0,mixer.loop.timeStart) // prevent recursion
      }
      return update.call( mixer, time )
    }
    mixer.update.patched = true
  }
}

xrf.frag.t.default = {x:1, y:0, z:0}

xrf.frag.t.calculateLoop = (t,obj,fps) => {
  obj.speed    = t.x 
  obj.speedAbs = Math.abs(t.x)
  obj.frameStart = t.y || obj.frameStart
  obj.frameStop  = t.z || obj.frameStop
  // always recalculate time using frameStart/Stop 
  obj.timeStart = obj.frameStart / (fps * obj.speedAbs)
  obj.timeStop  = obj.frameStop  / (fps * obj.speedAbs)
}

if( document.location.hash.match(/t=/) ){
  let url = document.location.href
  let playAfterUserGesture = () => {
    xrf.hashbus.pub(url) // re-post t fragment on the hashbus again
    window.removeEventListener('click',playAfterUserGesture)
    window.removeEventListener('touchstart',playAfterUserGesture)
  }
  window.addEventListener('click', playAfterUserGesture )
  window.addEventListener('touchstart', playAfterUserGesture )
}

xrf.addEventListener('parseModel', (opts) => {
  let {model,file,url} = opts
  // add animations
  model.clock       = new xrf.THREE.Clock();
  let mixer       = new xrf.THREE.AnimationMixer(model.scene)
  mixer.play  = (play) => {
    mixer.isPlaying = play
    model.animations.map( (anim) => { 
      anim.action = mixer.clipAction( anim )
      anim.action.setLoop(THREE.LoopOnce,0)
      if( play === false) anim.action.stop() 
      else anim.action.play() 
    })
    xrf.emit( play === false ? 'stop' : 'play',{play})
  }
  mixer.stop = () => {
    mixer.play(false)
  }
  mixer.duration  = model.animations.length ? model.animations[0].duration : 1
  mixer.frames    = model.animations.length ? model.animations[0].tracks[0].times.length : 1
  mixer.loop      = mixer.loop || {frameStart:0,frameStop:99999999,speed: 1}
  mixer.loop.fps  = mixer.frames / mixer.duration 
  model.mixer = mixer
})

xrf.addEventListener('render', (opts) => {
  let model = xrf.model
  let {time} = opts
  if( !model || !model.clock ) return
  model.mixer.update( time )

  // update camera if possible
  if( model.cameras.length && model.mixer.isPlaying ){

    let cam = xrf.camera.getCam() 
    // cam.fov = model.cameras[0].fov (why is blender not exporting radians?)
    cam.far = model.cameras[0].far
    cam.near = model.cameras[0].near

    let rig = xrf.camera
    rig.position.copy( model.cameras[0].position )
    rig.position.y -= rig.offsetY // VR/AR compensate camera rig
    //rig.rotation.copy( model.cameras[0].rotation )

    rig.updateProjectionMatrix()
  }
})
