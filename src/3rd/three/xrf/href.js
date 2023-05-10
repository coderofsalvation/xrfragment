xrfragment.xrf.href = function(v, opts){
  let { mesh, model, camera, scene, renderer, THREE} = opts

  let size = 5
  let texture = mesh.material.map

  /*
	texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
  mesh.material = new THREE.MeshStandardMaterial( {
    envMap: texture,
    roughness: 0.0,
    metalness: 1,
    side: THREE.DoubleSide,
  })
  */

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
        sampleUV.x = atan(direction.z, -direction.x) * -RECIPROCAL_PI2 + 0.5;
        gl_FragColor = texture2D(pano, sampleUV);
      }
    `
  });
}
