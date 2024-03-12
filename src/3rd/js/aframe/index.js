window.AFRAME.registerComponent('xrf', {
  schema: {
    http: { type:'string'},
    https: { type:'string'},
  },
  init: async function () {

    // override this.data when URL has passed (`://....com/?https://foo.com/index.glb` e.g.)
    if( typeof this.data == "string" ){
      let searchIsUri = document.location.search && 
                        !document.location.search.match(/=/) &&
                        document.location.search.match("/")
      if( searchIsUri || document.location.hash.length > 1 ){ // override url
        this.data = `${document.location.search.substr(1)}${document.location.hash}`
      }
    }

    if( !AFRAME.XRF ){

      let camera = document.querySelector('[camera]')
      // start with black
      camera.setAttribute('xrf-fade','')
      AFRAME.fade = camera.components['xrf-fade']

      let aScene = AFRAME.scenes[0] 

      // enable XR fragments
      let XRF = AFRAME.XRF = xrf.init({
        THREE,
        camera:    aScene.camera,
        scene:     aScene.object3D,
        renderer:  aScene.renderer,
        loaders: { 
          gltf: THREE.GLTFLoader, // which 3D assets (exts) to check for XR fragments?
          glb:  THREE.GLTFLoader,
          obj:  THREE.OBJLoader,
          fbx:  THREE.FBXLoader,
          usdz: THREE.USDZLoader,
          col:  THREE.ColladaLoader
        }
      })
      aScene.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      aScene.renderer.toneMappingExposure = 1.25;
      if( !XRF.camera ) throw 'xrfragment: no camera detected, please declare <a-entity camera..> ABOVE entities with xrf-attributes'
        
      if( AFRAME.utils.device.isMobile() ){
 //        aScene.setAttribute('webxr',"requiredFeatures: dom-overlay; overlayElement: canvas; referenceSpaceType: local")
      }

      aScene.addEventListener('loaded', () => {
        // this is just for convenience (not part of spec): enforce AR + hide/show stuff based on VR tags in 3D model 
        ARbutton = document.querySelector('.a-enter-ar-button')
        VRbutton = document.querySelector('.a-enter-vr-button')
        if( ARbutton ) ARbutton.addEventListener('click', () => AFRAME.XRF.hashbus.pub( '#-VR' ) )
        if( VRbutton ) VRbutton.addEventListener('click', () => AFRAME.XRF.hashbus.pub( '#VR' ) )
        //if( AFRAME.utils.device.checkARSupport() && VRbutton ){
        //  VRbutton.style.display = 'none'
        //  ARbutton.parentNode.style.right = '20px'
        //}
      })

      let repositionUser = (scale) => () => {
        // sometimes AFRAME resets the user position to 0,0,0 when entering VR (not sure why)
        let pos = xrf.frag.pos.last
        if( pos ){ AFRAME.XRF.camera.position.set(pos.x, pos.y*scale, pos.z) }
      }
      aScene.addEventListener('enter-vr', repositionUser(1) )
      aScene.addEventListener('enter-ar', repositionUser(2) )

      xrf.addEventListener('navigateLoaded', (opts) => {
        setTimeout( () => AFRAME.fade.out(),500) 
        let isLocal = opts.url.match(/^#/)
        if( isLocal ) return 

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
          let com = blinkControls.components['blink-controls']
          if( com ) com.update({collisionEntities:true})
          else console.warn("xrfragments: blink-controls is not mounted, please run manually: $('[blink-controls]).components['blink-controls'].update({collisionEntities:true})")

          blinkControls.addEventListener('teleported', (e) => {
            if( e.detail.newPosition.z < 0){
              console.warn('teleported to negative Z-value: https://github.com/jure/aframe-blink-controls/issues/30')
            }
          })
        }

        // give headset users way to debug without a cumbersome usb-tapdance
        if( document.location.hostname.match(/^(localhost|[1-9])/) && !aScene.getAttribute("vconsole") ){
          aScene.setAttribute('vconsole','')
        }

      })
      xrf.addEventListener('navigateError', (opts) => {
        AFRAME.fade.out()
      })

      xrf.addEventListener('navigateLoading', (opts) => {
        let p       = opts.promise()
        let url     = opts.url 
        let isLocal = url.match(/^#/)
        let hasPos  = url.match(/pos=/)
        let fastFadeMs = 200
        if( !AFRAME.fade  ) return p.resolve()

        if( isLocal ){
          if( hasPos ){
            // local teleports only
            AFRAME.fade.in(fastFadeMs)
            setTimeout( () => {
              p.resolve()
            }, fastFadeMs)
          }
        }else{
          AFRAME.fade.in(fastFadeMs)
          setTimeout( () => {
            p.resolve()
          }, AFRAME.fade.data.fadetime )
        }
      },{weight:-1000})

      // convert href's to a-entity's so AFRAME
      // raycaster can find & execute it
      AFRAME.XRF.clickableMeshToEntity = (opts) => {
        let {mesh,clickHandler} = opts;
        let createEl            = function(c){
          let el = document.createElement("a-entity")
          el.setAttribute("xrf-get",c.name )     // turn into AFRAME entity
          el.setAttribute("pressable", '' )      // detect click via hand-detection
          el.setAttribute("class","ray")         // expose to raycaster 
          // respond to cursor via laser-controls (https://aframe.io/docs/1.4.0/components/laser-controls.html)
          el.addEventListener("click",          clickHandler )
          el.addEventListener("mouseenter",     mesh.userData.XRF.href.selected(true) )
          el.addEventListener("mouseleave",     mesh.userData.XRF.href.selected(false) )
          $('a-scene').appendChild(el)
        }
        createEl(mesh)
      }
      xrf.addEventListener('interactionReady', AFRAME.XRF.clickableMeshToEntity )

      // cleanup xrf-get objects when resetting scene
      xrf.addEventListener('reset', (opts) => {
        let els = [...document.querySelectorAll('[xrf-get]')]
        els.map( (el) => document.querySelector('a-scene').removeChild(el) )
      })

      if( typeof this.data === 'string' || this.data.http || this.data.https ){
        let url
        if( typeof this.data === 'string' ) url = this.data
        if( this.data.http                ) url = `http:${this.data.http}`
        if( this.data.https               ) url = `https:${this.data.https}`
        AFRAME.XRF.navigator.to( url )
                            .then( (model) => {
                              let gets = [ ...document.querySelectorAll('[xrf-get]') ]
                              gets.map( (g) => g.emit('update') )
                            })
      }

      aScene.emit('XRF',{})
      
      // enable gaze-click on Mobile VR
      aScene.setAttribute('xrf-gaze','')

    }
  },

})
