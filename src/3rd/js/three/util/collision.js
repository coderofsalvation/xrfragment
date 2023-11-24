xrf.getCollisionMeshes = () => {
  let meshes = []
  xrf.scene.traverse( (n) => {
    if( !n.userData.href && !n.userData.src && xrf.hasNoMaterial(n) ){
      meshes.push(n)
    }
  })
  return meshes
}
