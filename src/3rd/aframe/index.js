window.AFRAME.registerComponent('xrf', {
  schema: {
  },
  init: function () {
    if( !AFRAME.XRF ) this.initXRFragments()
    if( this.data ){
      AFRAME.XRF.navigator.to(this.data)
                         .then( (model) => {
                           let gets = [ ...document.querySelectorAll('[xrf-get]') ]
                           gets.map( (g) => g.emit('update') )
                         })
    }
  },

  initXRFragments: function(){

    //window.addEventListener('popstate', clear )
    //window.addEventListener('pushstate', clear )

    // enable XR fragments
    let aScene = document.querySelector('a-scene')
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
      opts.camera = $('[camera]').object3D.parent 
      xrf(v,opts)
    }
    
    XRF.pos  = camOverride
    XRF.rot  = camOverride

    XRF.href = (xrf,v,opts) => { // convert portal to a-entity so AFRAME
      camOverride(xrf,v,opts)    // raycaster can find & execute it
      let {mesh,camera} = opts;
      let el = document.createElement("a-entity")
      el.setAttribute("xrf-get",mesh.name )
      el.setAttribute("class","collidable")
      el.addEventListener("click", mesh.userData.XRF.href.exec )
      $('a-scene').appendChild(el)
    }

    // cleanup xrf-get objects when resetting scene
    XRF.reset = ((reset) => () => {
      console.log("aframe reset")
      let els = [...document.querySelectorAll('[xrf-get]')]
      els.map( (el) => document.querySelector('a-scene').removeChild(el) )
      reset()
    })(XRF.reset)
  },
})

window.AFRAME.registerComponent('xrf-get', {
  schema: {
    name: {type: 'string'},
    clone: {type: 'boolean', default:false}
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
      if( !this.data.clone              ) mesh.parent.remove(mesh)
      ////mesh.updateMatrixWorld();
      this.el.object3D.position.setFromMatrixPosition(scene.matrixWorld);
      this.el.object3D.quaternion.setFromRotationMatrix(scene.matrixWorld);
      mesh.xrf = true // mark for deletion by xrf
      this.el.setObject3D('mesh', mesh );
      if( !this.el.id ) this.el.setAttribute("id",`xrf-${mesh.name}`)

    })

    if( this.el.className == "collidable" ) this.el.emit("update")

  }

});

