window.AFRAME.registerComponent('xrf', {
  schema: {
  },
  init: function () {
    if( !AFRAME.XRF ){
      document.querySelector('a-scene').addEventListener('loaded', () => {

        // enable XR fragments
        let aScene = document.querySelector('a-scene')
        let XRF = AFRAME.XRF = xrf.init({
          THREE,
          camera:    aScene.camera,
          scene:     aScene.object3D,
          renderer:  aScene.renderer,
          debug: true,
          loaders: { 
            gltf: THREE.GLTFLoader, // which 3D assets (exts) to check for XR fragments?
            glb: THREE.GLTFLoader
          }
        })
        if( !XRF.camera ) throw 'xrfragment: no camera detected, please declare <a-entity camera..> ABOVE entities with xrf-attributes'

        // in order to set the rotation programmatically
        // we need to disable look-controls
        xrf.rot  = (xrf,v,opts) => {
          let {frag,renderer} = opts;
          if( frag.q ) return // camera was not targeted for rotation 
          let look = document.querySelector('[look-controls]')
          if( look ) look.removeAttribute("look-controls")
          // *TODO* make look-controls compatible, because simply
          // adding the look-controls will revert to the old rotation (cached somehow?)
          //setTimeout( () => look.setAttribute("look-controls",""), 100 )
        }

        // convert href's to a-entity's so AFRAME
        // raycaster can find & execute it
        AFRAME.XRF.clickableMeshToEntity = (opts) => {
          let {mesh,clickHandler} = opts;
          let el = document.createElement("a-entity")
          el.setAttribute("xrf-get",mesh.name )  // turn into AFRAME entity
          el.setAttribute("class","ray")         // expose to raycaster 
          el.setAttribute("pressable", '')       // detect hand-controller click
          // add click
          el.addEventListener("click",          clickHandler )
          //el.addEventListener("pressedstarted", clickHandler )
          $('a-scene').appendChild(el)
        }
        xrf.addEventListener('interactionReady', AFRAME.XRF.clickableMeshToEntity )

        // cleanup xrf-get objects when resetting scene
        xrf.addEventListener('reset', (opts) => {
          console.log("aframe reset")
          let els = [...document.querySelectorAll('[xrf-get]')]
          els.map( (el) => document.querySelector('a-scene').removeChild(el) )
        })

        aScene.addEventListener('enter-vr', () => {
          // undo lookup-control shenanigans (which blocks updating camerarig position in VR)
          document.querySelector('[camera]').object3D.parent.matrixAutoUpdate = true 
          document.querySelector('[camera]').removeAttribute("look-controls")
          document.querySelector('[camera]').removeAttribute("wasd-controls")
        })

        AFRAME.XRF.navigator.to(this.data)
                           .then( (model) => {
                             let gets = [ ...document.querySelectorAll('[xrf-get]') ]
                             gets.map( (g) => g.emit('update') )
                           })

        aScene.emit('XRF',{})
        
        // enable gaze-click on Mobile VR
        aScene.setAttribute('xrf-gaze','')

      })
    }

    if( typeof this.data == "string" ){
      if( document.location.search || document.location.hash.length > 1 ){ // override url
        this.data = `${document.location.search.substr(1)}${document.location.hash}`
      }
    }
  },

})
