/**
 * Touch-to-move-forward controls for mobile.
 */
AFRAME.registerComponent('wasd-touchforward', {
  schema: {
    enabled: { default: true },
    reverseEnabled: { default: true }
  },

  init: function () {
    this.dVelocity = new THREE.Vector3();
    this.bindMethods();
    this.direction = 0;
  },

  play: function () {
    this.addEventListeners();
  },

  pause: function () {
    this.removeEventListeners();
    this.dVelocity.set(0, 0, 0);
  },

  remove: function () {
    this.pause();
  },

  addEventListeners: function () {
    const sceneEl = this.el.sceneEl;
    const canvasEl = sceneEl.canvas;

    if (!canvasEl) {
      sceneEl.addEventListener('render-target-loaded', this.addEventListeners.bind(this));
      return;
    }
    canvasEl.addEventListener('touchstart', this.onTouchStart);
    canvasEl.addEventListener('touchend', this.onTouchEnd);
    this.acceleration = $('[wasd-controls]').components['wasd-controls'].data.acceleration
  },

  removeEventListeners: function () {
    const canvasEl = this.el.sceneEl && this.el.sceneEl.canvas;
    if (!canvasEl) { return; }

    canvasEl.removeEventListener('touchstart', this.onTouchStart);
    canvasEl.removeEventListener('touchend', this.onTouchEnd);
  },

  isVelocityActive: function () {
    return this.data.enabled && !!this.direction;
  },

  getVelocityDelta: function () {
    this.dVelocity.z = this.direction;
    return this.dVelocity.clone();
  },

  bindMethods: function () {
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
  },

  onTouchStart: function (e) {
    let wasd = $('[wasd-controls]').components['wasd-controls']
    let keys = wasd.keys 
    if (this.data.reverseEnabled && e.touches && e.touches.length === 1) {
      wasd.data.acceleration = parseInt(this.acceleration/3)
      keys.ArrowUp = 1
    }
    if (this.data.reverseEnabled && e.touches && e.touches.length === 2) {
      alert("click!")
    }
    //e.preventDefault();
  },

  onTouchEnd: function (e) {
    let wasd = $('[wasd-controls]').components['wasd-controls']
    let keys = wasd.keys 
    delete keys.ArrowUp
    wasd.data.acceleration = this.acceleration
    e.preventDefault();
  },

});
