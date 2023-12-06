xrf.frag.t = function(v, opts){
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts
  if( !model.mixer ) return 
  if( !model.animations || model.animations[0] == undefined ) return console.warn('no animation in scene')

  xrf.mixers.map ( (mixer) => {
    
    mixer.t = v
    
    // update speed
    mixer.timeScale     = mixer.loop.speed = v.x
    mixer.loop.speedAbs = Math.abs(v.x)

    if( v.y != undefined || v.z != undefined ) mixer.updateLoop( v )

    // play animations
    mixer.play( v )
  })
}

xrf.frag.t.default = {
  x:0,  // (play from) offset (in seconds)  
  y:0   // optional: (stop at) offset (in seconds)
}

// setup animation mixer for global scene & src scenes
xrf.addEventListener('parseModel', (opts) => {
  let {model} = opts
  let mixer   = model.mixer = new xrf.THREE.AnimationMixer(model.scene)
  mixer.model = model
  mixer.loop      = {timeStart:0,timeStop:0}
  mixer.i         = xrf.mixers.length
  mixer.actions   = []

  model.animations.map( (anim) => { 
    anim.optimize()
    console.log("action: "+anim.name)
    mixer.actions.push( mixer.clipAction( anim, model.scene ) )
  })


  mixer.checkZombies = (animations) => {
    if( mixer.zombieCheck ) return // fire only once
    animations.map( (anim) => {  
      // collect zombie animations and warn user
      let zombies = anim.tracks.map( (t) => {
        let name = t.name.replace(/\..*/,'')
        let obj  = model.scene.getObjectByName(name)
        return !model.scene.getObjectByName(name) ? {anim:anim.name,obj:name} : undefined 
      })
      if( zombies.length > 0 && mixer.i == 0 ){ // only warn for zombies in main scene (because src-scenes might be filtered anyways)
        zombies
        .filter( (z) => z ) // filter out undefined
        .map( (z) => console.warn(`gltf: object '${z.obj}' not found (anim: '${z.anim}'`) )
        console.warn(`TIP: remove dots in objectnames in blender (which adds dots when duplicating)`)
      } 
    })
    mixer.zombieCheck = true
  }

  mixer.play  = (t) => {
    mixer.isPlaying = t.x != 0
    mixer.updateLoop(t)
    xrf.emit( mixer.isPlaying === false ? 'stop' : 'play',{isPlaying: mixer.isPlaying})
  }

  mixer.stop = () => {
    mixer.play(false)
  }

  mixer.updateLoop = (t) => {
    mixer.loop.timeStart = t.y != undefined ? t.y : mixer.loop.timeStart
    mixer.loop.timeStop  = t.z != undefined ? t.z : mixer.loop.timeStop
    mixer.actions.map( (action) => { 
      if( mixer.loop.timeStart != undefined ){
        action.time = mixer.loop.timeStart
        action.setLoop( xrf.THREE.LoopOnce, )
        action.timeScale = mixer.timeScale
        action.enabled = true
        if( t.x != 0 ){ 
          action.play() 
        }
      }
    })
    mixer.setTime(mixer.loop.timeStart)
    mixer.time = Math.abs( mixer.loop.timeStart )
    mixer.update(0)
    mixer.checkZombies( model.animations)
  }

  // update loop when needed 
  if( !mixer.update.patched ){
    let update = mixer.update
    mixer.update = function(time){
      mixer.time = Math.abs(mixer.time)
      if( time == 0 ) return update.call(this,time)

      // loop jump
      if( mixer.loop.speed > 0.0 && (mixer.loop.timeStop > 0 && mixer.time > mixer.loop.timeStop) ){ 
        setTimeout( (time,anims) => mixer.updateLoop(time), 0, mixer.loop.timeStart ) // prevent recursion
      }
      return update.call( this, time )
    }
    mixer.update.patched = true
  }

  // calculate total duration/frame based on longest animation
  mixer.duration  = 0
  if( model.animations.length ){
    model.animations.map( (a) => mixer.duration = ( a.duration > mixer.duration ) ? a.duration : mixer.duration )
  }

  xrf.mixers.push(mixer)
})

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

xrf.addEventListener('render', (opts) => {
  let model = xrf.model
  let {time} = opts
  if( !model ) return 
  if( xrf.mixers.length ){
    xrf.mixers.map( (m) => m.isPlaying && (m.update( time )) )

    // update active camera in case selected by dynamicKey in URI 
    if( xrf.model.camera && model.mixer.isPlaying ){

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
  }
})

xrf.addEventListener('dynamicKey', (opts) => {
  // select active camera if any
  let {id,match,v} = opts
  match.map( (w) => {
    w.nodes.map( (node) => {
      if( node.isCamera ){ 
        console.log("setting camera to "+node.name)
        xrf.model.camera = node 
      }
    })
  })
})
