xrf.getCollisionMeshes = () => {
  let meshes = []
  xrf.scene.traverse( (n) => {
    if( n.type == 'Mesh' && !n.userData.href && !n.userData.src && xrf.hasNoMaterial(n) ){
      meshes.push(n)
    }
  })
  return meshes
}
