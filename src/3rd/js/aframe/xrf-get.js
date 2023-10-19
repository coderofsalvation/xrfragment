window.AFRAME.registerComponent('xrf-get', {
  schema: {
    name: {type: 'string'},
    clone: {type: 'boolean', default:false}
  },

  init: function () {

    var el = this.el;
    var meshname = this.data.name || this.data;

    this.el.addEventListener('update', (evt) => {

      setTimeout( () => {

        if( !this.mesh && this.el.className == "ray" ){
          let scene = AFRAME.XRF.scene 
          let mesh = this.mesh = scene.getObjectByName(meshname);
          if (!mesh){
            console.error("mesh with name '"+meshname+"' not found in model")
            return;
          }
          // convert to worldcoordinates
//          mesh.getWorldPosition(mesh.position)
//          mesh.getWorldScale(mesh.scale)
//          mesh.getWorldQuaternion(mesh.quaternion)
          mesh.isXRF = true    // mark for deletion by xrf
          this.el.object3D.add = (a) => a  // dummy
          this.el.setObject3D('mesh',mesh)
          // normalize position
          //this.el.object3D.position.copy( mesh.position )
          //mesh.position.fromArray([0,0,0])
          if( !this.el.id ) this.el.setAttribute("id",`xrf-${mesh.name}`)

        }
      },500)

    })

    this.el.emit("update")

  }

});

