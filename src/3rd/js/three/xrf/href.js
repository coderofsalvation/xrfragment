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
  opts.embedded = v // indicate embedded XR fragment
  let { mesh, model, camera, scene, renderer, THREE} = opts

  if( mesh.userData.XRF.href.exec ) return // mesh already initialized

  const world = { 
    pos: new THREE.Vector3(), 
    scale: new THREE.Vector3(),
    quat: new THREE.Quaternion()
  }
  // detect equirectangular image
  let texture = mesh.material.map
  if( texture && texture.source.data.height == texture.source.data.width/2 ){
    texture.mapping = THREE.ClampToEdgeWrapping
    texture.needsUpdate = true

    // poor man's equi-portal
    mesh.material = new THREE.ShaderMaterial( {
      side: THREE.DoubleSide,
      uniforms: {
        pano: { value: texture },
        selected: { value: false },
      },
      vertexShader: `
         vec3 portalPosition;
         varying vec3 vWorldPosition;
         varying float vDistanceToCenter;
         varying float vDistance;
         void main() {
           vDistanceToCenter = clamp(length(position - vec3(0.0, 0.0, 0.0)), 0.0, 1.0);
           portalPosition = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
           vDistance = length(portalPosition - cameraPosition);
           vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
           gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
         }
      `,
      fragmentShader: `
        #define RECIPROCAL_PI2 0.15915494
        uniform sampler2D pano;
        uniform bool selected;
        varying float vDistanceToCenter;
        varying float vDistance;
        varying vec3 vWorldPosition;
        void main() {
          vec3 direction = normalize(vWorldPosition - cameraPosition);
          vec2 sampleUV;
          sampleUV.y = -clamp(direction.y * 0.5  + 0.5, 0.0, 1.0);
          sampleUV.x = atan(direction.z, -direction.x) * -RECIPROCAL_PI2;
          sampleUV.x += 0.33; // adjust focus to AFRAME's a-scene.components.screenshot.capture()
          vec4 color = texture2D(pano, sampleUV);
          // Convert color to grayscale (lazy lite approach to not having to match tonemapping/shaderstacking of THREE.js)
          float luminance = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
          vec4 grayscale_color = selected ? color : vec4(vec3(luminance) + vec3(0.33), color.a);
          gl_FragColor = grayscale_color;
        }
      `,
    });
    mesh.material.needsUpdate = true
  }else mesh.material = mesh.material.clone()

  let click = mesh.userData.XRF.href.exec = (e) => {
    xrf
    .emit('href',{click:true,mesh,xrf:v})               // let all listeners agree
    .then( () => {
      if( v.string[0] == '#' && v.string.match(/\|/) ){  // apply modifications to scene
        xrf.eval( v.string, xrf.model, xrf.XRF.PV_OVERRIDE )
      }else xrf.navigator.to(v.string)                  // or let's surf to HREF!
    }) 
  }

  let selected = (state) => () => {
    if( mesh.selected == state ) return // nothing changed 
    if( mesh.material.uniforms ) mesh.material.uniforms.selected.value = state 
    else mesh.material.color.r = mesh.material.color.g = mesh.material.color.b = state ? 2.0 : 1.0
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
  mesh.addEventListener('nocollide', selected(false) )

  // lazy add mesh (because we're inside a recursive traverse)
  setTimeout( (mesh) => {
    mesh.getWorldPosition(world.pos)
    mesh.getWorldScale(world.scale)
    mesh.getWorldQuaternion(world.quat);
    mesh.position.copy(world.pos)
    mesh.scale.copy(world.scale)
    mesh.setRotationFromQuaternion(world.quat);
    xrf.interactive.add(mesh)
  }, 20, mesh )
}

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
