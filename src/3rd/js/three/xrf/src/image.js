/*
 * mimetype: image/png 
 * mimetype: image/jpg 
 * mimetype: image/gif 
 */

xrf.frag.src.type['image/png'] = function(url,opts){
  let {mesh,THREE} = opts
  let restrictTo3DBoundingBox = mesh.geometry

  mesh.material = new xrf.THREE.MeshBasicMaterial({ 
    map: null, 
    transparent: url.match(/\.(png|gif)/) ? true : false,
    side: THREE.DoubleSide,
    color: 0xFFFFFF,
    opacity:1
  });

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
    mesh.material.map = texture
    mesh.material.needsUpdate = true 
    mesh.needsUpdate = true
  } 

  let onLoad = (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    renderImage(texture)
  }

  new THREE.TextureLoader().load( url, onLoad, null, console.error );

}

xrf.frag.src.type['image/gif'] = xrf.frag.src.type['image/png']
xrf.frag.src.type['image/jpeg'] = xrf.frag.src.type['image/png']

