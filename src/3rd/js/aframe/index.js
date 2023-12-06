window.AFRAME.registerComponent('xrf', {
  schema: {
  },
  init: function () {
    if( !AFRAME.XRF ){

      let camera = document.querySelector('[camera]')
      // start with black
      camera.setAttribute('xrf-fade','')
      AFRAME.fade = camera.components['xrf-fade']

      if( document.location.host.match(/localhost/) ) document.querySelector('a-scene').setAttribute("stats",'')

      document.querySelector('a-scene').addEventListener('loaded', () => {

        // enable XR fragments
        let aScene = document.querySelector('a-scene')
        let XRF = AFRAME.XRF = xrf.init({
          THREE,
          camera:    aScene.camera,
          scene:     aScene.object3D,
          renderer:  aScene.renderer,
          loaders: { 
            gltf: THREE.GLTFLoader, // which 3D assets (exts) to check for XR fragments?
            glb: THREE.GLTFLoader
          }
        })
        if( !XRF.camera ) throw 'xrfragment: no camera detected, please declare <a-entity camera..> ABOVE entities with xrf-attributes'

        xrf.addEventListener('navigateLoaded', () => {
          setTimeout( () => AFRAME.fade.out(),500) 

          // *TODO* this does not really belong here perhaps
          let blinkControls = document.querySelector('[blink-controls]')
          if( blinkControls ){
            let els       = xrf.getCollisionMeshes()
            let invisible = false
            els.map( (mesh) => {
              if( !invisible ){
                invisible = mesh.material.clone()
                invisible.visible = false
              }
              mesh.material = invisible 
              let el = document.createElement("a-entity")
              el.setAttribute("xrf-get", mesh.name )
              el.setAttribute("class","floor")
              $('a-scene').appendChild(el)
            })
            blinkControls.components['blink-controls'].update({collisionEntities:true})
          }
        })

        xrf.addEventListener('href', (opts) => {
          if( opts.click){ 
            let p       = opts.promise()
            let url     = opts.xrf.string
            let isLocal = url.match(/^#/)
            let hasPos  = url.match(/pos=/)
            if( isLocal && hasPos ){
              // local teleports only
              let fastFadeMs = 200
              AFRAME.fade.in(fastFadeMs)
              setTimeout( () => {
                p.resolve()
                AFRAME.fade.out(fastFadeMs)
              }, fastFadeMs)
            }else if( !isLocal ){
              AFRAME.fade.in()
              setTimeout( () => {
                p.resolve()
                setTimeout( () => AFRAME.fade.out(), 1000 ) // allow one second to load textures e.g.
              }, AFRAME.fade.data.fadetime )
            }else p.resolve()
          }
        })

        // patch wasd-controls to affect camera-rig
        if( camera.components['wasd-controls'] ){
          camera.components['wasd-controls'].tick = function(time,delta){
            var data = this.data;
            var el = this.el;
            var velocity = this.velocity;
            function isEmptyObject(keys) {
              var key;
              for (key in keys) { return false; }
              return true;
            }

            if (!velocity[data.adAxis] && !velocity[data.wsAxis] &&
                isEmptyObject(this.keys)) { return; }

            // Update velocity.
            delta = delta / 1000;
            this.updateVelocity(delta);

            if (!velocity[data.adAxis] && !velocity[data.wsAxis]) { return; }


            // Transform direction relative to heading.
            let directionVector = this.getMovementVector(delta)
            var rotationEuler = new THREE.Euler(0, 0, 0, 'YXZ');
            rotationEuler.set(THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(xrf.camera.rotation.y + 45), 0);
            directionVector.applyEuler(rotationEuler);
            // Get movement vector and translate position to camera-rig (not camera)
            xrf.camera.position.add(directionVector);
          }.bind( camera.components['wasd-controls'] )        
        }

        // convert href's to a-entity's so AFRAME
        // raycaster can find & execute it
        AFRAME.XRF.clickableMeshToEntity = (opts) => {
          let {mesh,clickHandler} = opts;
          let el = document.createElement("a-entity")
          el.setAttribute("xrf-get",mesh.name )  // turn into AFRAME entity
          el.setAttribute("class","ray")         // expose to raycaster 
          el.setAttribute("pressable", '')       // detect hand-controller click
          // respond to cursor via laser-controls (https://aframe.io/docs/1.4.0/components/laser-controls.html)
          el.addEventListener("click",          clickHandler )
          el.addEventListener("mouseenter", mesh.userData.XRF.href.selected(true) )
          el.addEventListener("mouseleave", mesh.userData.XRF.href.selected(false) )
          el.addEventListener("pressedstarted", clickHandler )
          $('a-scene').appendChild(el)
        }
        xrf.addEventListener('interactionReady', AFRAME.XRF.clickableMeshToEntity )

        // cleanup xrf-get objects when resetting scene
        xrf.addEventListener('reset', (opts) => {
          let els = [...document.querySelectorAll('[xrf-get]')]
          els.map( (el) => document.querySelector('a-scene').removeChild(el) )
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
