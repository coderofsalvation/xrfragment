/* 
 * TODO: refactor/fix this (queries are being refactored to filters)
 */
// spec: https://xrfragment.org/#filters
xrf.filter = function(){

}

xrf.filter.scene = function(opts){
  let {scene,frag} = opts

  xrf.filter 
  .sort(frag)            // get (sorted) filters from XR Fragments
  .process(frag,scene)   // show/hide things
  
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
  // include all when query starts with negative objectnames/tags are included
  let firstFilter = frag.filters[0].filter.get()
  let  showAll = firstFilter.show === false 
  let  showers = frag.filters.filter( (v) => v.filter.get().show === true ) 
  if( !showAll ) scene.traverse( (n) => n.visible = false )

  // reparent if first selector is positive and has no value
  if( firstFilter.show === true ){
    let obj = scene.getObjectByName( firstFilter.key )
    while( scene.children.length > 0 ) scene.children[0].removeFromParent()
    if(obj) scene.add(obj)
  }
 
  frag.filters.map( (v) => {
    const filter  = v.filter.get()
    const name_or_tag = v.fragment.replace(/[-\*]/g,'')
    let seen = {}

    const setVisibleUnseen = (m,visible) => {
      if( seen[m.uuid] ) return 
      m.visible = visible 
      seen[ m.uuid ] = true 
    }

    scene.traverse( (m) => {
      const isMatch = m.name == name_or_tag || m.userData[filter.key]

      // filter on value(expression) #foo=>3 e.g.
      if( filter.value && m.userData[filter.key] ){
        const visible = v.filter.testProperty(filter.key, m.userData[filter.key], filter.show === false )
        setVisibleUnseen(m,visible)
        if( filter.deep ){ 
          m.traverse( (n) => setVisibleUnseen(n,visible) )
        }
        return
      }

      // include/exclude object(s) when id/tag matches (#foo or #-foo e.g.) 
      if( isMatch ){
        m.visible   = filter.show
        if( filter.deep ) m.traverse( (n) => n.visible = m.visible )
      }
    })
  })
  return xrf.filter
}

