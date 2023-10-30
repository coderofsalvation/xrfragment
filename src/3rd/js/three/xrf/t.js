xrf.frag.t = function(v, opts){
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts
  if( !model.mixer ) return 
  if( !model.animations || model.animations[0] == undefined ) return console.warn('no animation in scene')

  model.mixer.t = v
  let mixer     = model.mixer
  xrf.frag.t.calculateLoop( v, mixer.loop, mixer.loop.fps )
  
  // update speed
  mixer.timeScale = mixer.loop.speed

  if( v.y != undefined || v.z != undefined ) xrf.mixers[0].updateLoop( mixer.loop.timeStart )
  if( v.y > 0 && v.z > 0 ){
    xrf.model.animations.map( (anim) => { 
      if( !anim.action ) return 
      anim.action.setLoop( v.z == 0 ? THREE.LoopOnce : THREE.LoopRepeat, v.z == 0 ? 0 : 99999999)
    })
  }

  // play animations
  mixer.play( v.x != 0 ) 

}

xrf.frag.t.default = {x:1, y:0, z:0}

xrf.frag.t.calculateLoop = (t,obj,fps) => {
  obj.speed      = t ? t.x : 0 
  obj.speedAbs   = Math.abs(obj.speed)
  obj.frameStart = t ? t.y || obj.frameStart : 1
  obj.frameStop  = t ? t.z || obj.frameStop  : 0
  // always recalculate time using frameStart/Stop 
  obj.timeStart  = obj.frameStart == 0 ? obj.mixerStart || 0 : obj.frameStart-1 / (fps * obj.speedAbs) 
  obj.timeStop   = obj.frameStop  / (fps * obj.speedAbs)
}

xrf.frag.t.setupMixer = function(opts){
  let {model,file,url} = opts
  let mixer = model.mixer = new xrf.THREE.AnimationMixer(model.scene)

  mixer.play  = (play) => {
    mixer.isPlaying = play
    model.animations.map( (anim) => { 
      if( !anim.action ){
        anim.action = mixer.clipAction( anim )
        anim.action.enabled = true
        anim.action.setLoop(THREE.LoopOnce)
      }
      if( mixer.isPlaying === false) anim.action.stop() 
      else{
        anim.action.play() 
      }
      mixer.update(0)
    })
    xrf.emit( play === false ? 'stop' : 'play',{play})
  }

  mixer.stop = () => {
    mixer.play(false)
  }

  mixer.updateLoop = (time) => {
    console.log("updateLoop "+time)
    mixer.setTime(time)
    mixer.time = Math.abs(time)
    mixer.update(0) // (forgetting) this little buddy costed me lots of time :]
  }

  // update loop when needed 
  if( !mixer.update.patched ){
    let update = mixer.update
    mixer.update = function(time){
      mixer.time = Math.abs(mixer.time)
      if( time == 0 ) return update.call(this,time)

      // loop jump
      //if( mixer.loop.speed > 0.0 && mixer.time > mixer.loop.timeStop * mixer.loop.speedAbs ){ 
      //  setTimeout( (time) => mixer.updateLoop(time),0,mixer.loop.timeStart) // prevent recursion
      //}
      return update.call( this, time )
    }
    mixer.update.patched = true
  }

  // calculate total duration/frame based on longest animation
  mixer.duration  = 0
  mixer.frames    = 0
  if( model.animations.length ){
    model.animations.map( (a) => {
      mixer.duration = a.duration               > mixer.duration ? a.duration               : mixer.duration 
      mixer.frames   = a.tracks[0].times.length > mixer.frames   ? a.tracks[0].times.length : mixer.frames
    })
  }

  mixer.loop      = {fps: mixer.frames / mixer.duration} 
  xrf.frag.t.calculateLoop( null, mixer.loop, mixer.loop.fps ) // gltf uses looppoints in seconds (not frames)
  xrf.mixers.push(mixer)
  console.log("mixer fps="+mixer.loop.fps+" frames:"+mixer.frames+" duration:"+mixer.duration)
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
  xrf.frag.t.setupMixer(opts)
})

xrf.addEventListener('render', (opts) => {
  let model = xrf.model
  let {time} = opts
  if( !model ) return 
  if( xrf.mixers.length ) xrf.mixers.map( (m) => m.update( time ) )

  // update camera if possible
  if( model.cameras && model.cameras.length && xrf.mixers.length ){

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
