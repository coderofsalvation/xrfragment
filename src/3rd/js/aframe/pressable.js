// this makes WebXR hand controls able to click things (by touching it)

AFRAME.registerComponent('pressable', {
    schema: {
        pressDistance: {
            default: 0.01
        }
    },
    init: function() {
        this.worldPosition = new THREE.Vector3();
        this.handWorldPosition = new THREE.Vector3();
        this.handEls = document.querySelectorAll('[hand-tracking-controls]');
        this.pressed = false;
        
    },
    tick: function() {
        var handEls = this.handEls;
        var handEl;
        var distance;
        for (var i = 0; i < handEls.length; i++) {
            handEl = handEls[i];
            let indexTipPosition  = handEl.components['hand-tracking-controls'].indexTipPosition
            handEl.object3D.localToWorld( this.handWorldPosition )
            this.handWorldPosition.add( indexTipPosition )

            distance = this.calculateFingerDistance(this.handWorldPosition);
            if( xrf.debug == 10 && this.el.id == "xrf-button_teleport_me_down_there" ){ debugger }

            if (distance < this.data.pressDistance && distance !== 0.0 ) {
                if (!this.pressed) {
                    this.el.emit('pressedstarted');
                }
                this.pressed = true;
                return;
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
