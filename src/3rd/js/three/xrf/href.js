/**
 * 
 * navigation, portals & mutations
 * 
 * | fragment | type | scope | example value |
 * |`href`| string (uri or predefined view) | 🔒 |`#pos=1,1,0`<br>`#pos=1,1,0&rot=90,0,0`<br>`#pos=pyramid`<br>`#pos=lastvisit|pyramid`<br>`://somefile.gltf#pos=1,1,0`<br> |
 * 
 * [[» example implementation|https://github.com/coderofsalvation/xrfragment/blob/main/src/3rd/three/xrf/href.js]]<br>
 * [[» example 3D asset|https://github.com/coderofsalvation/xrfragment/blob/main/example/assets/href.gltf#L192]]<br>
 * [[» discussion|https://github.com/coderofsalvation/xrfragment/issues/1]]<br>
 *
 * [img[xrfragment.jpg]]
 * 
 * 
 * !!!spec 1.0
 * 
 * 1. an ''external''- or ''file URI'' fully replaces the current scene and assumes `pos=0,0,0&rot=0,0,0` by default (unless specified)
 * 
 * 2. navigation should not happen when queries (`q=`) are present in local url: queries will apply (`pos=`, `rot=` e.g.) to the targeted object(s) instead.
 * 
 * 3. navigation should not happen ''immediately'' when user is more than 2 meter away from the portal/object containing the href (to prevent accidental navigation e.g.)
 * 
 * 4. URL navigation should always be reflected in the client (in case of javascript: see [[here|https://github.com/coderofsalvation/xrfragment/blob/dev/src/3rd/three/navigator.js]] for an example navigator).
 * 
 * 5. In XR mode, the navigator back/forward-buttons should be always visible (using a wearable e.g., see [[here|https://github.com/coderofsalvation/xrfragment/blob/dev/example/aframe/sandbox/index.html#L26-L29]] for an example wearable)
 * 
 * [img[navigation.png]]
 * 
 */

xrf.frag.href = function(v, opts){
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts

  if( mesh.userData.XRF.href.exec ) return // mesh already initialized

  let click = mesh.userData.XRF.href.exec = (e) => {

    if( !mesh.material.visible ) return

    // bubble up!
    mesh.traverseAncestors( (n) => n.userData && n.userData.href && n.dispatchEvent({type:e.type,data:{}}) )

    let lastPos   = `pos=${camera.position.x.toFixed(2)},${camera.position.y.toFixed(2)},${camera.position.z.toFixed(2)}`
    xrf
    .emit('href',{click:true,mesh,xrf:v}) // let all listeners agree
    .then( () => {

      let {urlObj,dir,file,hash,ext} = xrf.parseUrl(v.string)
      const isLocal = v.string[0] == '#'
      const hasPos  = isLocal && v.string.match(/pos=/)
      const flags   = isLocal ? xrf.XRF.PV_OVERRIDE : undefined

      //let toFrag = xrf.URI.parse( v.string, xrf.XRF.NAVIGATOR | xrf.XRF.PV_OVERRIDE | xrf.XRF.METADATA )
      if( v.xrfScheme ){
        xrf.hashbus.pub(v.string)
      } else xrf.navigator.to(v.string)    // let's surf
    }) 
    .catch( console.error )
  }

  let selected = mesh.userData.XRF.href.selected = (state) => () => {
    if( mesh.selected == state ) return // nothing changed 

    xrf.interactive.objects.map( (o) => {
      let newState = o.name == mesh.name ? state : false
      if( o.material ){
        if( o.material.uniforms && o.material.uniforms.selected ) o.material.uniforms.selected.value = newState 
        //if( o.material.emissive ) o.material.emissive.r = o.material.emissive.g = o.material.emissive.b = newState ? 2.0 : 1.0
        if( o.material.emissive ){ 
          if( !o.material.emissive.original ) o.material.emissive.original = o.material.emissive.clone()
          o.material.emissive.r = o.material.emissive.g = o.material.emissive.b = 
            newState ? o.material.emissive.original.r + 0.5 : o.material.emissive.original.r
        }
      }
    })
    // update mouse cursor
    if( !renderer.domElement.lastCursor )
      renderer.domElement.lastCursor = renderer.domElement.style.cursor
    renderer.domElement.style.cursor = state ? 'pointer' : renderer.domElement.lastCursor 

    xrf
    .emit('href',{selected:state,mesh,xrf:v}) // let all listeners agree
    .then( () => mesh.selected = state )
  }

  mesh.addEventListener('click', click )
  mesh.addEventListener('mousemove', selected(true) )
  mesh.addEventListener('mouseenter', selected(true) )
  mesh.addEventListener('mouseleave', selected(false) )

  if( mesh.material ) mesh.material = mesh.material.clone() // clone, so we can individually highlight meshes

  // lazy add mesh (because we're inside a recursive traverse)
  setTimeout( (mesh) => {
    xrf.interactive.add(mesh)
    xrf.emit('interactionReady', {mesh,xrf:v,clickHandler: mesh.userData.XRF.href.exec })
  }, 0, mesh )
}

xrf.addEventListener('audioInited', function(opts){
  let {THREE,listener} = opts
  opts.audio = opts.audio || {}
  opts.audio.click    = opts.audio.click || '/example/assets/audio/click.wav'
  opts.audio.hover    = opts.audio.hover || '/example/assets/audio/hover.wav'
  opts.audio.teleport = opts.audio.teleport || '/example/assets/audio/teleport.wav'

  let audio = xrf.frag.href.audio = {}

  actions = ['click','hover','teleport']
  actions.map( (action) => {
    const audioLoader = new THREE.AudioLoader();
    audio[action] = new THREE.Audio( xrf.camera.listener )
    audioLoader.load( opts.audio[action], function( buffer ) {
      audio[action].setBuffer( buffer );
    })
  });

  xrf.addEventListener('href', (opts) => {
    let v = opts.xrf
    if( opts.selected ){
      xrf.frag.href.audio.hover.stop() 
      xrf.frag.href.audio.hover.play() 
      return
    }
    if( opts.click ){
      xrf.frag.href.audio.click.stop() 
      xrf.frag.href.audio.click.play() 
      return
    }
  })

  xrf.addEventListener('navigateLoading', (e) => {
      xrf.frag.href.audio.click.stop() 
      xrf.frag.href.audio.teleport.stop() 
      xrf.frag.href.audio.teleport.play() 
  })


})

/**
 * > above solutions were abducted from [[this|https://i.imgur.com/E3En0gJ.png]] and [[this|https://i.imgur.com/lpnTz3A.png]] survey result
 *
 * !!!Demo
 * 
 * <$videojs controls="controls" aspectratio="16:9" preload="auto" poster="" fluid="fluid" class="vjs-big-play-centered">
 *   <source src="https://coderofsalvation.github.io/xrfragment.media/href.mp4" type="video/mp4"/>
 * </$videojs>
 * 
 * > capture of <a href="./example/aframe/sandbox" target="_blank">aframe/sandbox</a>
 */
