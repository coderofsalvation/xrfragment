window.AFRAME.registerComponent('xrf-get', {
  schema: {
    name: {type: 'string'},
    clone: {type: 'boolean', default:false}
  },

  init: function () {

    var el = this.el;
    var meshname = this.data.name || this.data;

    this.el.addEventListener('update', (evt) => {

      let scene = AFRAME.XRF.scene 
      let mesh = scene.getObjectByName(meshname);
      if (!mesh){
        console.error("mesh with name '"+meshname+"' not found in model")
        return;
      }
      // convert to worldcoordinates
      mesh.getWorldPosition(mesh.position)
      mesh.getWorldScale(mesh.scale)
      mesh.getWorldQuaternion(mesh.quaternion)
      if( !this.data.clone              ) mesh.parent.remove(mesh)
      mesh.isXRF = true // mark for deletion by xrf
      this.el.setObject3D('mesh', mesh );
      if( !this.el.id ) this.el.setAttribute("id",`xrf-${mesh.name}`)

    })

    if( this.el.className == "ray" ) this.el.emit("update")

  }

});

