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
    indexFingerReady: function(){
      if( this.system.indexFinger.length == 2){
        console.dir(this.system.indexFinger)
      }
    }
  }

})

AFRAME.registerSystem('xrf-pressable',{

  init: function(){
    this.sceneEl.addEventListener('loaded', () => this.getFingers() )
  },

  getFingers: function(){
    let handEls      = [...document.querySelectorAll('[hand-tracking-controls]')]
    this.indexFinger = []

    const me = this

    const addColliderToFingerTip = function(handEl,indexFinger){
      // add obb-collider to index finger-tip
      let aentity = document.createElement('a-entity')
      trackedObject3DVariable = `parentNode.components.hand-tracking-controls.bones.${indexFinger}`;
      handEl.appendChild(aentity)
      aentity.setAttribute('obb-collider', {trackedObject3D: trackedObject3DVariable, size: 0.015});
      return this
    }

    for( let i in handEls ){
      let handEl = handEls[i]
      handEl.addEventListener('model-loaded', function(e){
        const handEl = this
        // wait for bones get initialized
        setTimeout( () => {
          let bones = handEl.components['hand-tracking-controls'].bones
          let indexFinger
          for( let j = 0; j < bones.length; j++){
            if( bones[j].name == "index-finger-tip" ){
              indexFinger = j
              me.indexFinger.push(bones[j])
              addColliderToFingerTip(handEl,indexFinger)
              const els = [...document.querySelectorAll('[xrf-pressable]')]
              els.map( (el) => el.emit('indexFingerReady',{}) )
              break
            }
          }
        },500)
      })
    }

  }


})

