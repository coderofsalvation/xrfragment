window.AFRAME.registerComponent('xrf', {
  schema: {
    rig: {type: 'selector'}
  },
  init: function () {
    if( !AFRAME.XRF ) this.initXRFragments()
    if( typeof this.data == "string" ){
      AFRAME.XRF.navigate.to(this.data)
                         .then( (model) => {
                           let gets = [ ...document.querySelectorAll('[xrf-get]') ]
                           gets.map( (g) => g.emit('update') )
                         })
    }
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
      loaders: { gltf: THREE.GLTFLoader }  // which 3D assets (exts) to check for XR fragments?
    })
    if( !XRF.camera ) throw 'xrfragment: no camera detected, please declare <a-entity camera..> ABOVE entities with xrf-attributes'
        
    // override the camera-related XR Fragments so the camera-rig is affected 
    let camOverride = (xrf,v,opts) => {
      opts.camera = $('[camera]').object3D //parentElement.object3D 
      xrf(v,opts)
    }
    
    XRF.pos  = camOverride
    XRF.rot  = camOverride

    XRF.href = (xrf,v,opts) => { // convert portal to a-entity so AFRAME
      camOverride(xrf,v,opts)    // raycaster can reach it
      let {mesh,camera} = opts;
      let el = document.createElement("a-entity")
      el.setAttribute("xrf-get",mesh.name )
      el.setAttribute("class","collidable")
      el.addEventListener("click", (e) => {
        mesh.handleTeleport()   // *TODO* rename to fragment-neutral mesh.xrf.exec() e.g.
        //$('#player').object3D.position.copy(camera.position)
      })
      $('a-scene').appendChild(el)
    }

  },
})

window.AFRAME.registerComponent('xrf-get', {
  schema: {
    name: {type: 'string'},
    duplicate: {type: 'boolean'}
  },

  init: function () {

    var el = this.el;
    var meshname = this.data.name || this.data;

    this.el.addEventListener('update', (evt) => {

      let scene = AFRAME.XRF.scene 
      let mesh = scene.getObjectByName(meshname);
      if (!mesh){
        console.error("mesh with name '"+meshname+"' not found in model")
        return;
      }
      if( !this.data.duplicate ) mesh.parent.remove(mesh)
      if( this.mesh            ) this.mesh.parent.remove(this.mesh) // cleanup old clone 
      let clone = this.mesh = mesh.clone()
      ////mesh.updateMatrixWorld();
      this.el.object3D.position.setFromMatrixPosition(scene.matrixWorld);
      this.el.object3D.quaternion.setFromRotationMatrix(scene.matrixWorld);
      this.el.setObject3D('mesh', clone );
      if( !this.el.id ) this.el.setAttribute("id",`xrf-${clone.name}`)

    })

    if( this.el.className == "collidable" ) this.el.emit("update")

  }

});

