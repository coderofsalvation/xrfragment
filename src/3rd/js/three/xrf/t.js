xrf.frag.t = function(v, opts){
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts
  console.log(`   └ setting animation loop to ${v.x} ${v.y} ${v.z}` )
  if( !model.animations || model.animations[0] == undefined ) return console.warn('no animation in scene')

  model.mixer.t = v
  let duration  = model.animations[0].duration
  let frames    = model.animations[0].tracks[0].times.length
  let mixer     = model.mixer
  mixer.loop    = mixer.loop || {frameStart:0,frameStop:99999999,speed: 1}
  let fps       = frames / duration 

  mixer.loop.speed    = v.x 
  mixer.loop.speedAbs = Math.abs(v.x)
  mixer.loop.frameStart = v.y || mixer.loop.frameStart
  mixer.loop.frameStop  = v.z || mixer.loop.frameStop
  // always recalculate time using frameStart/Stop 
  mixer.loop.timeStart = mixer.loop.frameStart / (fps * mixer.loop.speedAbs)
  mixer.loop.timeStop  = mixer.loop.frameStop  / (fps * mixer.loop.speedAbs)
  
  // update speed
  mixer.timeScale = mixer.loop.speed

  let updateTime = (time) => {
    mixer.setTime(time)
    mixer.time = Math.abs(mixer.time)
    mixer.update(0)      // (forgetting) this little buddy costed me lots of time :]
  }

  if( v.y > 0 || v.z > 0 ) updateTime( mixer.loop.timeStart )

  console.dir(mixer)

  // update loop jump
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
