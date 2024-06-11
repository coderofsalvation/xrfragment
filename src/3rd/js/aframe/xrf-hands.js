//// this makes WebXR hand controls able to click things (by touching it)

AFRAME.registerSystem('xrf-hands',{

  init: function(){
    this.sceneEl.addEventListener('loaded', () => this.getFingers() )
  },

  tick: function(){
    if( !this.el.sceneEl.renderer.xr.isPresenting || !this.indexFinger.length ) return 
    for( let i = 0; i < this.indexFinger.length; i++ ){
      let indexFinger = this.indexFinger[i]
      let intersects = xrf.interactive.intersect( indexFinger, 0.01 )
      if( intersects.length ){
        let obj = intersects[0].object
        if( obj.clicked ) return
        obj.clicked = true
        obj.dispatchEvent({type:"click", message: indexFinger })
        setTimeout( () => obj.clicked = false, 250 ) // prevent double clicks
      } 
    }
  },


  getFingers: function(){
    let handEls      = [...document.querySelectorAll('[hand-tracking-controls]')]
    if( !handEls.length ) return
    this.indexFinger = []

    const me = this

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
              const els = [...document.querySelectorAll('[xrf-pressable]')]
              els.map( (el) => el.emit('indexFingerReady', {index: j} ) )
              break
            }
          }
        },500)
      })
    }

  }


})

