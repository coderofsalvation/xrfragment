//// this makes WebXR hand controls able to click things (by touching it)

AFRAME.registerComponent('xrf-pressable', {

  init: function(){
  },

  tick: function(){
 //   if( this.system.indexFinger.length ) debugger
  },

  events:{
    obbcollisionstarted: function(e){
      if( !e.detail.trackedObject3D ) return
      console.dir(e)
    },
  }

})

AFRAME.registerSystem('xrf-pressable',{

  init: function(){
    this.sceneEl.addEventListener('loaded', () => this.getFingers() )
  },

  getFingers: function(){
    let handEls      = [...document.querySelectorAll('[hand-tracking-controls]')]
    this.indexFinger = []

    for( let i in handEls ){
      let handEl = handEls[i]
      handEl.addEventListener('model-loaded', () => {

        // wait for bones get initialized
        setTimeout( () => {
          let bones = handEl.components['hand-tracking-controls'].bones
          let indexFinger
          for( let j = 0; j < bones.length; i++){
            if( bones[j].name == "index-finger-tip" ){
              indexFinger = j
              console.log("ja")
              this.indexFinger.push(bones[j])
              console.dir(this.indexFinger)
              break
            }
          }
          // add obb-collider to index finger-tip
          let aentity = document.createElement('a-entity')
          trackedObject3DVariable = `parentNode.components.hand-tracking-controls.bones.${indexFinger}`;
          handEl.appendChild(aentity)
          aentity.setAttribute('obb-collider', {trackedObject3D: trackedObject3DVariable, size: 0.015});
          console.dir(this.indexFinger)
        },500)
      })
    }

  },


})

