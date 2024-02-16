xrf.optimize = (opts) => {
  opts.animatedObjects = []

  xrf.optimize
  .checkAnimations(opts)
  .freezeUnAnimatedObjects(opts)
  .disableShadows(opts)
  .disableEmbeddedLights(opts)
  .removeDuplicateLights()
}

  // check unused animations
xrf.optimize.checkAnimations = (opts) => {
  if( xrf.debug ) console.log("TODO: fix freezeUnAnimatedObjects for SRC's")
  return xrf.optimize

  let {model} = opts
  model.animations.map( (anim) => {  
    // collect zombie animations and warn user
    let zombies = anim.tracks.map( (t) => {
      let name = t.name.replace(/\..*/,'')
      let obj  = model.scene.getObjectByName(name)
      if( !model.scene.getObjectByName(name) ) return {anim:anim.name,obj:name}
      else opts.animatedObjects.push(name)
      return undefined
    })
    if( zombies.length > 0 ){ // only warn for zombies in main scene (because src-scenes might be filtered anyways)
      zombies
      .filter( (z) => z ) // filter out undefined
      .map( (z) => console.warn(`gltf: object '${z.obj}' not found (anim: '${z.anim}'`) )
      console.warn(`TIP: remove dots in objectnames in blender (which adds dots when duplicating)`)
    } 
  })
  return xrf.optimize
}

xrf.optimize.freezeUnAnimatedObjects = (opts) => {
  if( xrf.todo ) console.log("TODO: fix freezeUnAnimatedObjects for SRC's")
  return xrf.optimize

  let {model}  = opts
  let scene = model.scene
  // increase performance by freezing all objects
  scene.traverse( (n) => n.matrixAutoUpdate = false )
  // except animated objects and children
  scene.traverse( (n) => {
    if( ~opts.animatedObjects.indexOf(n.name) ){
      n.matrixAutoUpdate = true 
      n.traverse( (m) => m.matrixAutoUpdate = true )
    }
  })
  return xrf.optimize
}

xrf.optimize.disableShadows = (opts) => {
  opts.model.scene.traverse( (n) => {
    if( n.castShadow !== undefined ) n.castShadow = false
  })
  return xrf.optimize
}

xrf.optimize.disableEmbeddedLights = (opts) => {
  if( !opts.isSRC ) return xrf.optimize
  // remove lights from SRC's
  opts.model.scene.traverse( (n) => {
    if( n.type.match(/light/i) ) n.remove()
  })
  return xrf.optimize
}

xrf.optimize.removeDuplicateLights = () => {
  // local/extern src's can cause duplicate lights which tax performance 
  let lights = {}
  xrf.scene.traverse( (n) => {
    if( n.type.match(/light/i) ){
      if( !lights[n.name] ) lights[n.name] = true 
      else n.remove()
    }
  })
  return xrf.optimize
}

xrf.addEventListener('parseModel', (opts) => {
  xrf.optimize(opts)
})
