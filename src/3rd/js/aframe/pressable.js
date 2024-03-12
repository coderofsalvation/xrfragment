// this makes WebXR hand controls able to click things (by touching it)

AFRAME.registerComponent('pressable', {
    schema: {
        pressDistance: {
            default: 0.01
        }
    },
    init: function() {
        this.worldPosition = new THREE.Vector3();
        this.fingerWorldPosition = new THREE.Vector3();
        this.raycaster = new THREE.Raycaster()
        this.handEls = document.querySelectorAll('[hand-tracking-controls]');
        this.pressed = false;
        this.distance = -1
        // we throttle by distance, to support scenes with loads of clickable objects (far away)
        this.tick = this.throttleByDistance( () => this.detectPress() )
    },
    throttleByDistance: function(f){
        return function(){
           if( this.distance < 0 ) return f() // first call
           if( !f.tid ){
             let x = this.distance
             let y = x*(x*0.05)*1000 // parabolic curve
             f.tid = setTimeout( function(){
               f.tid = null
               f()
             }, y )
           }
        }
    },
    detectPress: function(){
        var handEls = this.handEls;
        var handEl;
        let minDistance = 5

        // compensate for xrf-get AFRAME component (which references non-reparented buffergeometries from the 3D model)
        let object3D = this.el.object3D.child || this.el.object3D

        for (var i = 0; i < handEls.length; i++) {
            handEl = handEls[i];
            let indexTipPosition  = handEl.components['hand-tracking-controls'].indexTipPosition
            // Apply the relative position to the parent's world position 
            handEl.object3D.updateMatrixWorld();
            handEl.object3D.getWorldPosition( this.fingerWorldPosition )
            this.fingerWorldPosition.add( indexTipPosition )

            this.raycaster.far = this.data.pressDistance
            // Create a direction vector (doesnt matter because it is supershort for 'touch' purposes)
            const direction = new THREE.Vector3(1.0,0,0);
            this.raycaster.set(this.fingerWorldPosition, direction)
            intersects = this.raycaster.intersectObjects([object3D],true)

            object3D.getWorldPosition(this.worldPosition)
      
            distance    = this.fingerWorldPosition.distanceTo(this.worldPosition)
            minDistance = distance < minDistance ? distance : minDistance 

            if (intersects.length ){
              if( !this.pressed ){
                this.el.emit('pressedstarted');
                this.el.emit('click');
                this.pressed = setTimeout( () => {
                  this.el.emit('pressedended');
                  this.pressed = null 
                },300)
              }
            }
        }
        this.distance = minDistance
    }
});
