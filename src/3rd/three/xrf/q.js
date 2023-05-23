xrf.frag.q = function(v, opts){
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts
  console.log("   └ running query ")
  for ( let i in v.query  ) {
    let target = v.query[i]

    // remove objects if requested
    if( target.id != undefined && (target.mesh = scene.getObjectByName(i)) ){  
      target.mesh.visible = target.id
      target.mesh.parent.remove(target.mesh)
      console.log(`     └ removing mesh: ${i}`)
    }else console.log(`     └ mesh not found: ${i}`)
  }
}
