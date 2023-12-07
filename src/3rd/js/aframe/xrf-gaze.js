// gaze click on mobile VR

AFRAME.registerComponent('xrf-gaze',{
  schema:{
    spawn:{type:'boolean',default:false}, 
  },
  setGazer: function(state){
    let cam = document.querySelector("[camera]") 
    if( state ){
      if( cam.innerHTML.match(/cursor/) ) return; // avoid duplicate calls
      cam.innerHTML = `<a-entity id="cursor" cursor="fuse: true; fuseTimeout: 1500"
        animation__click="property: scale; startEvents: click; easing: easeInCubic; dur: 150; from: 0.1 0.1 0.1; to: 1 1 1"
        animation__fusing="property: scale; startEvents: fusing; easing: easeInCubic; dur: 1500; from: 1 1 1; to: 0.1 0.1 0.1"
        animation__mouseleave="property: scale; startEvents: mouseleave; easing: easeInCubic; dur: 500; to: 1 1 1"
        raycaster="objects: .ray"
        visible="true"
        position="0 0 -1"
        geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.03"
        material="color: #BBBBBB; shader: flat">
      </a-entity>`
    }else{
      if( document.querySelector('[cursor]') ) {
        document.querySelector('[cursor]').setAttribute("visible",false)
      }
    }
  }, 
  init:function(data){
    this.log = ""
    let enabled    = () AFRAME.utils.device.isMobile()
    let setVisible = (state) => {
      if( enabled() ) this.setGazer(state)
    }

    setVisible(false);

    document.querySelector("a-scene").addEventListener('exit-vr', () => setVisible(false) )
    document.querySelector("a-scene").addEventListener('enter-vr', () => setVisible(true) )
    document.querySelector("a-scene").addEventListener('exit-ar', () => setVisible(false) )
    document.querySelector("a-scene").addEventListener('enter-ar', () => setVisible(true) )

    let highlightMesh = (state) => (e) => {
      if( !e.target.object3D ) return 
      let obj = e.target.object3D.children[0]
      if( obj && obj.userData && obj.userData.XRF && obj.userData.XRF.href )
        obj.userData.XRF.href.selected( state )()
    }
    this.el.addEventListener("mouseenter", highlightMesh(true) )
    this.el.addEventListener("mouseleave", highlightMesh(false ) )
  }
});
