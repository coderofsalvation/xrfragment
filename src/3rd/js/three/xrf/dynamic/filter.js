/* 
 * TODO: refactor/fix this (queries are being refactored to filters)
 */


xrf.addEventListener('dynamicKey', (opts) => {
  let {scene,id,match,v} = opts
  if( v.filter ){
    let frags = {}
    frags[ v.filter.key ] = v
    xrf.filter.scene({frag:frags,scene})
  }
})

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
  .sort(frag)               // get (sorted) filters from XR Fragments
  .process(frag,scene,opts) // show/hide things

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
  const cleanupKey   = (k) => k.replace(/[-\*\/]/g,'')
  let firstFilter    = frag.filters.length ? frag.filters[0].filter.get() : false 
  const hasName      = (m,name,filter)        => m.name == name 
  const hasNameOrTag = (m,name_or_tag,filter) => hasName(m,name_or_tag) || 
                                                 String(m.userData['tag']).match( new RegExp("(^| )"+name_or_tag) )
  // utility functions
  const getOrCloneMaterial = (o) => {
    if( o.material ){
      if( o.material.isXRF ) return o.material
      o.material = o.material.clone()
      o.material.isXRF = true
      return o.material
    }
    return {}
  }
  const setVisible = (n,visible,filter,processed) => {
    if( processed && processed[n.uuid] ) return 
    getOrCloneMaterial(n).visible = visible
    console.log(n.name+" => "+(visible?"show":"hide"))
    if( filter.deep ) n.traverse( (m) => getOrCloneMaterial(m).visible = visible )
    if( processed ) processed[n.uuid] == true 
  }

  // spec 2: https://xrfragment.org/doc/RFC_XR_Macros.html#embedding-xr-content-using-src
  // reparent scene based on objectname in case it matches a (non-negating) selector 
  if( opts.reparent && firstFilter && !firstFilter.value && firstFilter.show === true ){
    let obj 
    frag.target = firstFilter
    scene.traverse( (n) => hasName(n, firstFilter.key,firstFilter) && (obj = n) )
    if(obj){
      while( scene.children.length > 0 ) scene.children[0].removeFromParent()
      obj.position.set(0,0,0)
      scene.add( obj )
    }
  }

  // then show/hide things based on secondary selectors
  // we don't use the XRWG (everything) because we process only the given (sub)scene
  frag.filters.map( (v) => {
    const filter  = v.filter.get()
    const name_or_tag = cleanupKey(v.fragment)
    let processed = {}
    let extembeds = {}

    // hide external objects temporarely
    scene.traverse( (m) => {
      if( m.isSRCExternal ){
        m.traverse( (n) => (extembeds[ n.uuid ] = m) && (n.visible = false) )
      }
    })

    scene.traverseVisible( (m) => {
      // filter on value(expression) #foo=>3 e.g. *TODO* do this in XRWG
      if( filter.value && m.userData[filter.key] ){
        const visible = v.filter.testProperty(filter.key, m.userData[filter.key], filter.show === false )
        setVisible(m,visible,filter,processed)
        return
      }
      if( hasNameOrTag(m,name_or_tag,filter ) ){
        setVisible(m,filter.show,filter)
      }
    })

    // show external objects again 
    for ( let i in extembeds ) extembeds[i].visible = true
  })

  return xrf.filter
}

