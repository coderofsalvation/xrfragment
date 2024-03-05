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
    },
    tick: function() {
        var handEls = this.handEls;
        var handEl;
        var distance;

        // compensate for xrf-get AFRAME component (which references non-reparented buffergeometries from the 3D model)
        let object3D = this.el.object3D.child || this.el.object3D

        for (var i = 0; i < handEls.length; i++) {
            handEl = handEls[i];
            let indexTipPosition  = handEl.components['hand-tracking-controls'].indexTipPosition
            // Apply the relative position to the parent's world position 
            handEl.object3D.updateMatrixWorld();
            handEl.object3D.getWorldPosition( this.fingerWorldPosition )
            this.fingerWorldPosition.add( indexTipPosition )

            this.raycaster.far = 0.05
            // Create a direction vector (doesnt matter because it is supershort for 'touch' purposes)
            const direction = new THREE.Vector3(1.0,0,0);
            this.raycaster.set(this.fingerWorldPosition, direction)
            intersects = this.raycaster.intersectObjects([object3D],true)

            object3D.getWorldPosition(this.worldPosition)
      
            this.distance = this.fingerWorldPosition.distanceTo(this.worldPosition)

            if (intersects.length ){
              this.pressed = true
              this.el.emit('pressedstarted');
            }
        }
        if (this.pressed) {
            this.el.emit('pressedended');
        }
        this.pressed = false;
    },
    calculateFingerDistance: function(fingerPosition) {
        var el = this.el;
        //worldPosition.copy(el.object3D.position);
        el.object3D.updateMatrixWorld();
        el.object3D.localToWorld(this.worldPosition);
            if( xrf.debug == 10 && this.el.id == "xrf-button_teleport_me_down_there" ){ debugger }

        return this.worldPosition.distanceTo(fingerPosition);
    }
});
