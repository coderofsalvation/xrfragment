window.AFRAME.registerComponent('xrf', {
  schema: {
    rig: {type: 'selector'}
  },
  init: function () {
    if( !AFRAME.XRF ) this.initXRFragments()
    if( !this.rig && this.el.querySelector('[camera]') )
      AFRAME.XRF.rig = this.el
  },
  initXRFragments: function(){
    let aScene = document.querySelector('a-scene')
    // enable XR fragments
    let XRF = AFRAME.XRF = xrfragment.init({            
      THREE,
      camera:   aScene.camera,
      scene:    aScene.object3D,
      renderer: aScene.renderer,
      debug: true,
      loaders: [ THREE.GLTFLoader ],   // which 3D assets to check for XR fragments?
    })
        
    // override the 'pos' XR Fragment so we can translate the camera rig (not the camera itself)
    XRF.pos = (xrf,v,opts) => {
      let { mesh, model, camera, scene, renderer, THREE} = opts
      console.log("!pos")
      camera.parent.parent.position.x = v.x
      camera.parent.parent.position.y = v.y
      camera.parent.parent.position.z = v.z
      // xrf(v,opts) // skip threejs handler
    }

    // override the 'rot' XR Fragment so we can translate the camera rig (not the camera itself)
    XRF.rot = (xrf,v,opts) => {
      let { mesh, model, camera, scene, renderer, THREE} = opts
      camera.parent.parent.rotation.x = v.x * Math.PI / 180;
      camera.parent.parent.rotation.y = v.y * Math.PI / 180;
      camera.parent.parent.rotation.z = v.z * Math.PI / 180;
      // xrf(v,opts) // skip threejs handler
    }
  }
});

AFRAME.registerComponent('gltf-to-entity', {
  schema: {
    from: {default: '', type: 'selector'},
    name: {default: ''},
    duplicate: {type:'boolean'}
  },

  init: function () {
    var el = this.el;
    var data = this.data;

    data.from.addEventListener('model-loaded', evt => {
      var model;
      var subset;
      model = evt.detail.model;
      console.dir(this.data.from)
      subset = model.getObjectByName(data.name);
      if (!subset){
        console.error("Sub-object", data.name, "not found in #"+data.from.id);
        return;
      }
      if( !this.data.duplicate ) subset.parent.remove(subset)
      let clone = subset.clone()
      ////subset.updateMatrixWorld();
      el.object3D.position.setFromMatrixPosition(data.from.object3D.matrixWorld);
      el.object3D.quaternion.setFromRotationMatrix(data.from.object3D.matrixWorld);
      
      el.setObject3D('mesh', clone );
      el.emit('model-loaded', el.getObject3D('mesh'));

    });
  }
});
