xrf.sceneToTranscript = (scene, ignoreMesh ) => {
  let transcript = ''
  scene.traverse( (n) => {
    let isSRC = false
    n.traverseAncestors( (m) => m.userData.src ? isSRC = true : false )
    if( !isSRC && n.userData['aria-description'] && (!ignoreMesh || n.uuid != ignoreMesh.uuid) ){
      transcript += `<b>#${n.name}</b> ${n.userData['aria-description']}. `
    }
  })
  return transcript
}
