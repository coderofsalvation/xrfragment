/*
 * mimetype: image/png 
 * mimetype: image/jpg 
 * mimetype: image/gif 
 */

xrf.frag.src.type['image/png'] = function(url,opts){
  let {mesh} = opts
  let restrictTo3DBoundingBox = mesh.geometry

  let renderEquirect = (texture) => {
    console.dir(texture)
    texture.mapping = THREE.EquirectangularReflectionMapping
    texture.needsUpdate = true
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter =  THREE.NearestFilter 
    texture.minFilter =  THREE.NearestFilter 

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
          vec3 direction = normalize(vWorldPosition - cameraPosition );
          vec2 sampleUV;
          sampleUV.y = clamp(direction.y * 0.5  + 0.5, 0.0, 1.0);
          sampleUV.x = atan(direction.z, -direction.x) * -RECIPROCAL_PI2;
          sampleUV.x += 0.33; // adjust focus to AFRAME's a-scene.components.screenshot.capture()
          vec4 color = texture2D(pano, sampleUV);
          vec4 selected_color = selected ? color*vec4(1.5) : color;
          gl_FragColor = selected_color; 
        }
      `,
    });
    mesh.material.needsUpdate = true
  }

  let renderImage = (texture) => {
    let img = {w: texture.source.data.width, h: texture.source.data.height}

    // stretch image by pinning uv-coordinates to corners 
    if( mesh.geometry ){
      if( mesh.geometry.attributes.uv ){ // buffergeometries 
        let uv = mesh.geometry.attributes.uv;
      }else {
        console.warn("xrfragment: uv's of ${url} might be off for non-buffer-geometries *TODO*")
        //if( geometry.faceVertexUvs ){
        // *TODO* force uv's of dynamically created geometries (in threejs)
        //}
      }
    }
    //const geometry = new THREE.BoxGeometry();
    mesh.material = new THREE.MeshBasicMaterial({ 
      map: texture, 
      transparent: url.match(/(png|gif)/) ? true : false,
      side: THREE.DoubleSide,
      color: 0xFFFFFF,
      opacity:1
    });
  } 

  let onLoad = (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    // detect equirectangular image
    if( texture && texture.source.data.height == texture.source.data.width/2 ){
      renderEquirect(texture)
    }else{
      renderImage(texture)
    }
  }

  new THREE.TextureLoader().load( url, onLoad, null, console.error );

}

xrf.frag.src.type['image/gif'] = xrf.frag.src.type['image/png']
xrf.frag.src.type['image/jpeg'] = xrf.frag.src.type['image/png']

