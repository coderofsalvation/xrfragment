window.AFRAME.registerComponent('xrf-get', {
  schema: {
    name: {type: 'string'},
    clone: {type: 'boolean', default:false},
    reparent: {type: 'boolean', default:false}
  },

  init: function () {

    var el = this.el;
    var meshname = this.data.name || this.data;

    this.el.addEventListener('update', (evt) => {

      setTimeout( () => {

        if( !this.mesh ){
          let scene = AFRAME.XRF.scene 
          let mesh = this.mesh = scene.getObjectByName(meshname);
          if( !this.el.className.match(/ray/) ) this.el.className += " ray"
          if (!mesh){
            console.error("mesh with name '"+meshname+"' not found in model")
            return;
          }
          // we don't want to re-parent gltf-meshes
          mesh.isXRF = true    // mark for deletion by xrf
          if( this.data.reparent ){ 
            const world = { 
              pos: new THREE.Vector3(), 
              scale: new THREE.Vector3(),
              quat: new THREE.Quaternion()
            }
            mesh.getWorldPosition(world.pos)
            mesh.getWorldScale(world.scale)
            mesh.getWorldQuaternion(world.quat);
            mesh.position.copy(world.pos)
            mesh.scale.copy(world.scale)
            mesh.setRotationFromQuaternion(world.quat);
          }else{
            // lets create a dummy add function so that the mesh won't get reparented 
            this.el.object3D.add = (a) => a 
          }
          this.el.setObject3D('mesh',mesh)
          if( !this.el.id ) this.el.setAttribute("id",`xrf-${mesh.name}`)
        }else console.warn("xrf-get ignore: "+JSON.stringify(this.data))
      }, evt && evt.timeout ? evt.timeout: 500)

    })

    this.el.emit("update",{timeout:0})

    AFRAME.XRF.addEventListener('reset', () => {
      try{
        if( this.el ) this.el.remove()
      }catch(e){}
    })

  }

});

