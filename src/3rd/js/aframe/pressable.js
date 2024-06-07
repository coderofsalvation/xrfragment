//// this makes WebXR hand controls able to click things (by touching it)

AFRAME.registerComponent('pressable', {

  init: function(){
    let handEls = [...document.querySelectorAll('[hand-tracking-controls]')]

    for( let i in handEls ){
      let handEl = handEls[i]
      handEl.addEventListener('model-loaded', () => {
        if( handEl.pressable ) return

        // wait for bones get initialized
        setTimeout( () => {
          let bones = handEl.components['hand-tracking-controls'].bones
          let indexFinger
          for( let i = 0; i < bones.length; i++){
            if( bones[i].name == "index-finger-tip" ){
              indexFinger = i
              break
            }
          }
          // add obb-collider to index finger-tip
          let aentity = document.createElement('a-entity')
          trackedObject3DVariable = `parentNode.components.hand-tracking-controls.bones.${indexFinger}`;
          console.log(trackedObject3DVariable)
          handEl.appendChild(aentity)
          aentity.setAttribute('obb-collider', {trackedObject3D: trackedObject3DVariable, size: 0.015});
        },500)
      })
    }

  },


  events:{
    obbcollisionstarted: function(e){
      if( !e.detail.trackedObject3D ) return
      if( e.currentTarget && e.currentTarget.emit ){
        //e.currentTarget.emit('click',
      }
      console.dir(e)
    },
    "xrf-get": function(){
      //this.el.setAttribute('obb-collider',{trackedObject3D: 'el.object3D.child' }) // set collider on xrf-get object
      let aentity = document.createElement('a-entity')
      trackedObject3DVariable = this.el.object3D.child ? `parentNode.object3D.child` : `parentNode.object3D`
      console.log(trackedObject3DVariable)
      this.el.appendChild(aentity)
      aentity.setAttribute('obb-collider', {trackedObject3D: trackedObject3DVariable});
    }

  }

})
