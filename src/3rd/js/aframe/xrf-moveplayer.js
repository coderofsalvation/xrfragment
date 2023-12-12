// gaze click on mobile VR

AFRAME.registerComponent('xrf-moveplayer',{
  schema:{
  },
  init:function(data){
    this.player = document.querySelector('#player')
  },
  tick:function(){
    this.player.object3D.rotation.copy( this.el.object3D.rotation )
    this.player.object3D.position.copy( this.el.object3D.position )
  }
});
