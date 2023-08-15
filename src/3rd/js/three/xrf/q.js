// spec: https://xrfragment.org/#queries

xrf.frag.q = function(v, opts){
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts
  console.log("   └ running query ")
  let qobjs = Object.keys(v.query)

  // convience function for other fragments (which apply to the query)
  frag.q.getObjects = () => {
    let objs = []
    scene.traverse( (o) => {
      for ( let name in v.query ) {
        let qobj = v.query[name];
        if( qobj.class && o.userData.class && o.userData.class == name ) objs.push(o)
        else if( qobj.id && o.name == name ) objs.push(o)
      }
    })
    return objs.filter( (o) => o ) // return and filter out empty
               .map( (o) => {
                 if( !o.positionOriginal ) o.positionOriginal = o.position.clone() 
                 return o
               })
  }

  // spec: https://xrfragment.org/#src
  const instanceScene = () => {
    v.scene = new THREE.Group()
    for ( let i in v.query  ) {
      let target = v.query[i]
      if( !scene.getObjectByName(i) && i != '*' ) return console.log(`     └ mesh not found: ${i}`)
      if( i == '*' ){
        let cloneScene = scene.clone()
        // add interactive elements (href's e.g.) *TODO* this is called by both internal/external src's
        v.scene.add( xrf.interactive.clone() )
        cloneScene.children.forEach( (child) => v.scene.getObjectByName(child.name) ? null : v.scene.add(child) ) 
        target.mesh = v.scene
      }else{
        if( !v.scene.getObjectByName(i) && target.id === true ){ 
          console.log(`     └ query-ing mesh: ${i}`)
          v.scene.add( target.mesh = scene.getObjectByName(i).clone() )
        }
      }
      if( target.id != undefined && target.mesh  ){  
          target.mesh.position.set(0,0,0)
          target.mesh.rotation.set(0,0,0)
      }
    }
    // hide negative selectors
    let negative = []
    v.scene.traverse( (mesh) => {
      for ( let i in v.query  ) {
        if( mesh.name == i && v.query[i].id === false ) negative.push(mesh)
      }
    })
    negative.map( (mesh) => mesh.visible = false )
  }

  // spec: https://xrfragment.org/#queries
  const showHide = () => {
    let q = frag.q.query 
    scene.traverse( (mesh) => {
      for ( let i in q ) {
        let isMeshId       = q[i].id    != undefined 
        let isMeshClass    = q[i].class != undefined 
        let isMeshProperty = q[i].rules != undefined && q[i].rules.length && !isMeshId && !isMeshClass 
        if( q[i].root && mesh.isSRC ) continue;  // ignore nested object for root-items (queryseletor '/foo' e.g.)
        if( isMeshId       && i == mesh.name           ) mesh.visible = q[i].id 
        if( isMeshClass    && i == mesh.userData.class ) mesh.visible = q[i].class
        if( isMeshProperty && mesh.userData[i]         ) mesh.visible = (new xrf.Query(frag.q.string)).testProperty(i,mesh.userData[i])
      }
    })
  }

  const doLocalInstancing = opts.embedded && opts.embedded.fragment == 'src' && opts.embedded.string[0] == '#'
  if( doLocalInstancing ) instanceScene()  // spec : https://xrfragment.org/#src
  else showHide()                          // spec : https://xrfragment.org/#queries
}
