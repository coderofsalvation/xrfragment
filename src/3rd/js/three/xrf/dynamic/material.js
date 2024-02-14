xrf.frag.dynamic.material = function(v,opts){
  let {match} = opts

  // update material in case of <tag_or_object>[*]=<materialname>
  let material
  xrf.scene.traverse( (n) => n.material && (n.material.name == v.string) && (material = n.material) )
  if( !material && !v.reset ) return // nothing to do

  xrf.XRWG.deepApplyMatch(match, v, (match,v,node,type) => {
    if( node.material ) xrf.frag.dynamic.material.set( node, material, v.reset )
  })
}

xrf.frag.dynamic.material.set = function(mesh,material,reset){
  if( !mesh.materialOriginal ) mesh.materialOriginal = mesh.material
  let visible = mesh.material.visible //remember
  if( reset ){
    mesh.material = mesh.materialOriginal
  }else mesh.material = material
  mesh.material.visible = visible
}

// for reset calls like href: xrf://!myobject e.g.
xrf.addEventListener('dynamicKey', (opts) => {

  let {v,match} = opts

  if( v.reset ){
    xrf.XRWG.deepApplyMatch(match,v, (match,v,node,type) => {
      if( node.material ) xrf.frag.dynamic.material.set( node, null, v.reset )
    })
  } 

})
