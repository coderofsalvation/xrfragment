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
      cam.innerHTML = ''
    }
  }, 
  init:function(data){
    this.immersive = false;
    let enabled    = () => AFRAME.utils.device.isMobile()
    let setVisible = () => this.el.setAttribute('visible', enabled() )
    this.setGazer(enabled())
    setVisible();

    document.querySelector("a-scene").addEventListener('exit-vr', () => {
      this.immersive = false;
      setVisible()
    })
    document.querySelector("a-scene").addEventListener('enter-vr', () => {
      this.immersive = true;
      setVisible()
      if( !document.querySelector("#cursor") ) return
    })


    let highlightMesh = (state) => (e) => {
      if( !e.target.object3D ) return 
      let obj = e.target.object3D.children[0]
      if( obj.userData && obj.userData.XRF && obj.userData.XRF.href )
        obj.userData.XRF.href.selected( state )()
    }
    this.el.addEventListener("mouseenter", highlightMesh(true) )
    this.el.addEventListener("mouseleave", highlightMesh(false ) )

    //this.el.addEventListener('click',function(evt){
    //  document.querySelector('a-scene').querySelector('#player').setAttribute('position',{
    //    x:this.getAttribute('position').x,
    //    y:this.getAttribute('position').y,
    //    z:this.getAttribute('position').z
    //  });
    //});
  }
});
