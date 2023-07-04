// *TODO* use webgl instancing

xrf.frag.src = function(v, opts){
  opts.embedded = v // indicate embedded XR fragment
  let { mesh, model, camera, scene, renderer, THREE} = opts
  let src = new THREE.Group()

  if( v.string[0] == "#" ){ // local 
    console.log("   └ instancing src")
    let frag = xrfragment.URI.parse(v.string)
    
    // apply embedded XR fragments
    setTimeout( () => {
      // apply URI XR Fragments inside src-value 
      for( var i in frag ){
        xrf.eval.fragment(i, Object.assign(opts,{frag, model,scene}))
      }
      if( frag.q.query ){  
        let srcScene = frag.q.scene // three/xrf/q.js initializes .scene
        if( !srcScene || !srcScene.visible ) return 
        console.log("       └ inserting "+i+" (srcScene)")
        srcScene.position.set(0,0,0)
        srcScene.rotation.set(0,0,0)
        srcScene.traverse( (m) => {
          m.isSRC = true
          if( m.userData && (m.userData.src || m.userData.href) ) return ;//delete m.userData.src // prevent infinite recursion 
          xrf.eval.mesh(m,{scene,recursive:true}) 
        })
        console.dir(xrf)
        if( srcScene.visible ) src.add( srcScene )
      }
      src.position.copy( mesh.position )
      src.rotation.copy( mesh.rotation )
      src.scale.copy( mesh.scale )
      mesh.add(src)
      if( !opts.recursive ) mesh.material.visible = false // lets hide the preview object because deleting disables animations+nested objs
    },10)
  }
}
