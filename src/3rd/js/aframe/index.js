window.AFRAME.registerComponent('xrf', {
  schema: {
  },
  init: function () {
    if( !AFRAME.XRF ){
      document.querySelector('a-scene').addEventListener('loaded', () => {

        //window.addEventListener('popstate', clear )
        //window.addEventListener('pushstate', clear )

        // enable XR fragments
        let aScene = document.querySelector('a-scene')
        let XRF = AFRAME.XRF = xrf.init({
          THREE,
          camera:   aScene.camera,
          scene:    aScene.object3D,
          renderer: aScene.renderer,
          debug: true,
          loaders: { 
            gltf: THREE.GLTFLoader, // which 3D assets (exts) to check for XR fragments?
            glb: THREE.GLTFLoader
          }
        })
        if( !XRF.camera ) throw 'xrfragment: no camera detected, please declare <a-entity camera..> ABOVE entities with xrf-attributes'

        // override the camera-related XR Fragments so the camera-rig is affected
        let camOverride = (xrf,v,opts) => {
          opts.camera = document.querySelector('[camera]').object3D.parent
          xrf(v,opts)
        }

        xrf.pos  = camOverride

        // in order to set the rotation programmatically
        // we need to disable look-controls
        xrf.rot  = (xrf,v,opts) => {
          let {frag,renderer} = opts;
          if( frag.q ) return // camera was not targeted for rotation 
          let look = document.querySelector('[look-controls]')
          if( look ) look.removeAttribute("look-controls")
 //         camOverride(xrf,v,opts)
          // *TODO* make look-controls compatible, because simply
          // adding the look-controls will revert to the old rotation (cached somehow?)
          //setTimeout( () => look.setAttribute("look-controls",""), 100 )
        }

        // convert portal to a-entity so AFRAME
        // raycaster can find & execute it
        xrf.href = (xrf,v,opts) => {
          camOverride(xrf,v,opts)
          let {mesh,camera} = opts;
          let el = document.createElement("a-entity")
          el.setAttribute("xrf-get",mesh.name )
          el.setAttribute("class","ray")
          el.addEventListener("click", mesh.userData.XRF.href.exec )
          $('a-scene').appendChild(el)
        }

        // cleanup xrf-get objects when resetting scene
        xrf.reset = ((reset) => () => {
          reset()
          console.log("aframe reset")
          let els = [...document.querySelectorAll('[xrf-get]')]
          els.map( (el) => document.querySelector('a-scene').removeChild(el) )
        })(XRF.reset)

        // undo lookup-control shenanigans (which blocks updating camerarig position in VR)
        aScene.addEventListener('enter-vr', () => document.querySelector('[camera]').object3D.parent.matrixAutoUpdate = true )

        AFRAME.XRF.navigator.to(this.data)
                           .then( (model) => {
                             let gets = [ ...document.querySelectorAll('[xrf-get]') ]
                             gets.map( (g) => g.emit('update') )
                           })

        aScene.emit('XRF',{})
      })
    }

    if( typeof this.data == "string" ){
      if( document.location.search || document.location.hash.length > 1 ){ // override url
        this.data = `${document.location.search.substr(1)}${document.location.hash}`
      }
    }
  },

})
