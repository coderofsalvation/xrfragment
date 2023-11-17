/* 
 * TODO: refactor/fix this (queries are being refactored to filters)
 */
// spec: https://xrfragment.org/#filters
xrf.filter = function(query, cb){
  let result = []
  if( !query     ) return result
  if( query[0] != '#' ) query = '#'+query
  // *TODO* jquery like utility func
  return result
}

xrf.filter.scene = function(opts){
  let {scene,frag} = opts

  xrf.filter 
  .sort(frag)            // get (sorted) filters from XR Fragments
  .process(frag,scene)   // show/hide things

  scene.visible = true   // always enable scene

  return scene
}

xrf.filter.sort = function(frag){
  // get all filters from XR Fragments
  frag.filters = Object.values(frag)
                      .filter( (v) => v.filter ? v : null )
                      .sort( (a,b) => a.index > b.index )
  return xrf.filter
}

xrf.filter.process = function(frag,scene,opts){
  const hasName      = (m,name,filter)        => m.name == name 
  const hasNameOrTag = (m,name_or_tag,filter) => hasName(m,name_or_tag) || 
                                                 String(m.userData['tag']).match( new RegExp("(^| )"+name_or_tag) )
  const cleanupKey   = (k) => k.replace(/[-\*]/g,'')

  let firstFilter = frag.filters[0].filter.get()
  let  showers    = frag.filters.filter( (v) => v.filter.get().show === true ) 

  // spec 2: https://xrfragment.org/doc/RFC_XR_Macros.html#embedding-xr-content-using-src
  // reparent scene based on objectname in case it matches a (non-negating) selector 
  if( !firstFilter.value && firstFilter.show === true ){
    let obj 
    scene.traverse( (n) => hasName(n, firstFilter.key,firstFilter) && (obj = n) )
    if(obj){
      while( scene.children.length > 0 ) scene.children[0].removeFromParent()
      scene.add( obj )
    }
  }

  const setVisible = (n,visible,processed) => {
    if( processed && processed[n.uuid] ) return 
    n.visible = visible
    n.traverse( (n) => n.visible = visible )

    // for hidden parents, clone material and set material to invisible
    // otherwise n will not be rendered
    if( visible ){
      n.traverseAncestors( (parent) => {
        if( !parent.visible ){
          parent.visible = true
          if( parent.material && !parent.material.isXRF ){
            parent.material = parent.material.clone()
            parent.material.visible = false
          }
        }
      })
    }
    if( processed ) processed[n.uuid] == true 
  }

  // then show/hide things based on secondary selectors
  frag.filters.map( (v) => {
    const filter  = v.filter.get()
    const name_or_tag = cleanupKey(v.fragment)
    let processed = {}

    scene.traverse( (m) => {
      // filter on value(expression) #foo=>3 e.g.
      if( filter.value && m.userData[filter.key] ){
        const visible = v.filter.testProperty(filter.key, m.userData[filter.key], filter.show === false )
        setVisible(m,visible,processed)
        return
      }
      // include/exclude object(s) when id/tag matches (#foo or #-foo e.g.) 
      if( hasNameOrTag(m,name_or_tag,filter) ){
        setVisible(m,filter.show)
      }
    })
  })

  return xrf.filter
}

