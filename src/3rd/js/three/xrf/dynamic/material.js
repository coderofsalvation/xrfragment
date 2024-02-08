xrf.frag.dynamic.material = function(v,opts){
  let {match} = opts

  setMaterial = (mesh,material,reset) => {
    if( !mesh.materialOriginal ) mesh.materialOriginal = mesh.material
    if( reset ) mesh.material = mesh.materialOriginal
    else mesh.material = material
  }

  // update material in case of <tag_or_object>[*]=<materialname>
  let material
  xrf.scene.traverse( (n) => n.material && (n.material.name == v.string) && (material = n.material) )
  if( !material && !v.reset ) return // nothing to do

  if( material ) xrf.frag.dynamic.material.setMatch(match,material,v)
}

xrf.frag.dynamic.material.setMatch = function(match,material,v){
  match.map( (m) => {
    m.nodes.map( (n) => {
      n.material = setMaterial( n, material, v.reset )
      if( v.filter.q.deep ) n.traverse( (c) => c.material && setMaterial( c, material, v.reset ) )
    })
  })
}

xrf.addEventListener('dynamicKey', (opts) => {

  let {v,match} = opts

  if( v.reset ){
    xrf.frag.dynamic.material.setMatch(match,null,v)
  } 

})
