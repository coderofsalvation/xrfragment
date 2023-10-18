xrf.frag.t = function(v, opts){
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts
  console.log(`   └ setting animation loop to ${v.x} ${v.y} ${v.z}` )
  if( !model.animations || model.animations[0] == undefined ) return console.warn('no animation in scene')

  model.mixer.t = v
  let duration  = model.animations[0].duration
  let frames    = model.animations[0].tracks[0].times.length
  let mixer     = model.mixer
  mixer.loop    = mixer.loop || {frameStart:0,frameStop:99999999,speed: 1}
  mixer.loop.fps = frames / duration 

  xrf.frag.t.calculateLoop( v, mixer.loop, mixer.loop.fps )
  
  // update speed
  mixer.timeScale = mixer.loop.speed

  let updateTime = (time) => {
    mixer.setTime(time)
    mixer.time = Math.abs(mixer.time)
    mixer.update(0)      // (forgetting) this little buddy costed me lots of time :]
    // (re)trigger audio
  }

  //if( v.x != 0 ) xrf.emit('play',v) *TODO* touchend/usergesture
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
