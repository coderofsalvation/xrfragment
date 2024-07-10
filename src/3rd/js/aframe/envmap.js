// poor man's way to move forward using hand gesture pinch

window.AFRAME.registerComponent('envmap', {
  schema:{
    src: {type: "string"}
  }, 
  init: function(){
    const loader = new THREE.TextureLoader();
    const onLoad = (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.needsUpdate = true
      xrf.scene.environment = texture 
      xrf.scene.texture = texture 
    }
    new THREE.TextureLoader().load( this.data.src, onLoad, null, console.error );

    xrf.addEventListener('navigateLoaded', () => {
      xrf.scene.traverse( (n) => {
        if( n.material && n.material.isMeshPhysicalMaterial){
          n.material.envMap = xrf.scene.environment
          n.material.needsUpdate = true
        }
      })
    })

  }, 
})
