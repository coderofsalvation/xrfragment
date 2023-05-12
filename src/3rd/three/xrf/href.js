xrf.frag.href = function(v, opts){
  let { mesh, model, camera, scene, renderer, THREE} = opts

  let texture = mesh.material.map
  texture.mapping = THREE.ClampToEdgeWrapping
  texture.needsUpdate = true
  mesh.material.dispose()

  // poor man's equi-portal
  mesh.material = new THREE.ShaderMaterial( {
    side: THREE.DoubleSide,
    uniforms: {
      pano: { value: texture }
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
      varying float vDistanceToCenter;
      varying float vDistance;
      varying vec3 vWorldPosition;
      void main() {
        vec3 direction = normalize(vWorldPosition - cameraPosition);
        vec2 sampleUV;
        sampleUV.y = -clamp(direction.y * 0.5  + 0.5, 0.0, 1.0);
        sampleUV.x = atan(direction.z, -direction.x) * -RECIPROCAL_PI2;
        sampleUV.x += 0.33; // adjust focus to AFRAME's $('a-scene').components.screenshot.capture()
        vec4 color = texture2D(pano, sampleUV);
        // Convert color to grayscale (lazy lite approach to not having to match tonemapping/shaderstacking of THREE.js)
        float luminance = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
        vec4 grayscale_color = vec4(vec3(luminance) + vec3(0.33), color.a);
        gl_FragColor = grayscale_color;
      }
    `,
  });
  mesh.material.needsUpdate = true

  mesh.handleTeleport = (e) => {              
    if( mesh.clicked ) return 
    mesh.clicked = true
    let portalArea = 1 // 1 meter
    const meshWorldPosition = new THREE.Vector3();
    meshWorldPosition.setFromMatrixPosition(mesh.matrixWorld);

    const cameraDirection = new THREE.Vector3();
    camera.getWorldPosition(cameraDirection);
    cameraDirection.sub(meshWorldPosition);
    cameraDirection.normalize();
    cameraDirection.multiplyScalar(portalArea); // move away from portal
    const newPos = meshWorldPosition.clone().add(cameraDirection);

    const positionInFrontOfPortal = () => {
      camera.position.copy(newPos);
      camera.lookAt(meshWorldPosition);

      if( xrf.baseReferenceSpace ){ // WebXR VR/AR roomscale reposition
        const offsetPosition = { x: -newPos.x, y: 0, z: -newPos.z, w: 1 };
        const offsetRotation = new THREE.Quaternion();
        const transform = new XRRigidTransform( offsetPosition, offsetRotation );
        const teleportSpaceOffset = xrf.baseReferenceSpace.getOffsetReferenceSpace( transform );
        xrf.renderer.xr.setReferenceSpace( teleportSpaceOffset );
      }

      document.location.hash = `#pos=${camera.position.x},${camera.position.y},${camera.position.z}`;
    }

    const distance = camera.position.distanceTo(newPos);
    if( distance > portalArea ) positionInFrontOfPortal()
    else xrf.navigate.to(v.string) // ok let's surf to HREF!
    
    setTimeout( () => mesh.clicked = false, 200 ) // prevent double clicks 
  }
  
  if( !opts.frag.q ) mesh.addEventListener('click', mesh.handleTeleport )

  // lazy remove mesh (because we're inside a traverse)
  setTimeout( () => {
    model.interactive.add(mesh) // make clickable
  },200)
}
