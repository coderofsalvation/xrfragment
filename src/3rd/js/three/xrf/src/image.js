/*
 * mimetype: image/png 
 * mimetype: image/jpg 
 * mimetype: image/gif 
 */

xrf.frag.src.type['image/png'] = function(url,opts){
  let {mesh} = opts
  let restrictTo3DBoundingBox = mesh.geometry
  const texture = new THREE.TextureLoader().load( url );
	texture.colorSpace = THREE.SRGBColorSpace;

  //const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ 
    map: texture, 
    transparent: url.match(/(png|gif)/) ? true : false,
    side: THREE.DoubleSide,
    color: 0xFFFFFF,
    opacity:1
  });

  // stretch image by pinning uv-coordinates to corners 
  if( mesh.geometry ){
    if( mesh.geometry.attributes.uv ){ // buffergeometries 
      let uv = mesh.geometry.attributes.uv;
      //       i  u  v
      uv.setXY(0, 0, 0 )
      uv.setXY(1, 1, 0 )
      uv.setXY(2, 0, 1 )
      uv.setXY(3, 1, 1 )
    }else {
      console.warn("xrfragment: uv's of ${url} might be off for non-buffer-geometries *TODO*")
      //if( geometry.faceVertexUvs ){
      // *TODO* force uv's of dynamically created geometries (in threejs)
      //}
    }
  }
  mesh.material = material
}
xrf.frag.src.type['image/gif'] = xrf.frag.src.type['image/png']
xrf.frag.src.type['image/jpg'] = xrf.frag.src.type['image/png']

