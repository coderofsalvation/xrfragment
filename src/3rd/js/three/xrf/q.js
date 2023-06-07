xrf.frag.q = function(v, opts){
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts
  console.log("   └ running query ")
  let qobjs = Object.keys(v.query)

  v.scene = new THREE.Group()
  for ( let i in v.query  ) {
    let target = v.query[i]
    if( !scene.getObjectByName(i) && i != '*' ) return console.log(`     └ mesh not found: ${i}`)
    if( i == '*' ){
      let cloneScene = scene.clone()
      cloneScene.children.forEach( (child) => v.scene.getObjectByName(child.name) ? null : v.scene.add(child) ) 
      target.mesh = v.scene
    }else{
      console.log(`     └ query-ing mesh: ${i}`)
      if( !v.scene.getObjectByName(i) && target.id === true ){ 
        v.scene.add( target.mesh = scene.getObjectByName(i).clone() )
      }
    }
    if( target.id != undefined && target.mesh  ){  
        target.mesh.position.set(0,0,0)
        target.mesh.rotation.set(0,0,0)
    }
  }
  // remove negative selectors
  let remove = []
  v.scene.traverse( (mesh) => {
    for ( let i in v.query  ) {
      if( mesh.name == i && v.query[i].id === false ) remove.push(mesh)
    }
  })
  remove.map( (mesh) => mesh.parent.remove( mesh ) )
}
