xrf.macros = {}

xrf.addEventListener('mesh', (opts) => {
  let { frag, mesh, model, camera, scene, renderer, THREE, hashbus} = opts

  for( let k in frag ){
    let id = mesh.name+"_"+k
    let fragment = frag[k]

    if( k.match(/^!/) ){
      if( mesh.material) mesh.material = mesh.material.clone()
      if( mesh.isSRC || scene.isSRC ) return; // dont allow recursion for now

      if( xrf.macros[k] ) return // already initialized  

      console.log("└ initing xrmacro: "+k)
      xrf.macros[k] = fragment
      fragment.args = fragment.string.split("|")

      fragment.trigger = (e) => {
        xrf
        .emit('macro',{click:true,mesh,xrf:frag}) // let all listeners agree
        .then( () => {
              rrFrag = fragment.args[ xrf.roundrobin( fragment,model) ]
              console.log("└ xrmacro: "+rrFrag)
              if( xrf.macros[ rrFrag ] ){
                xrf.macros[ rrFrag ].trigger()
              } else {
                xrf.navigator.to( rrFrag,null,0)
              }
        }) 
      }

      let selected = (state) => () => {
        if( mesh.selected == state ) return // nothing changed 
        if( mesh.material ){
          if( mesh.material.uniforms ) mesh.material.uniforms.selected.value = state 
          else mesh.material.color.r = mesh.material.color.g = mesh.material.color.b = state ? 2.0 : 1.0
        }
        // update mouse cursor
        if( !renderer.domElement.lastCursor )
          renderer.domElement.lastCursor = renderer.domElement.style.cursor
        renderer.domElement.style.cursor = state ? 'pointer' : renderer.domElement.lastCursor 
        xrf
        .emit('macro',{selected:state,mesh,xrf:frag}) // let all listeners agree
        .then( () => mesh.selected = state )
      }

      mesh.addEventListener('click', fragment.trigger )
      mesh.addEventListener('mousemove', selected(true) )
      mesh.addEventListener('nocollide', selected(false) )

      // lazy add mesh to interactive group (because we're inside a recursive traverse)
      setTimeout( (mesh) => {
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
        xrf.interactive.add(mesh)
        xrf.emit('interactionReady', {mesh,xrf:fragment, clickHandler: fragment.trigger})
      }, 10, mesh )
    }
  }
})
