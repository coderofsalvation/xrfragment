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
  const hasNameOrTag = (m,name_or_tag,filter) => hasName(m,name_or_tag) || m.userData[filter.key]
  const cleanupKey   = (k) => k.replace(/[-\*]/g,'')

  let firstFilter = frag.filters[0].filter.get()
  let  showers    = frag.filters.filter( (v) => v.filter.get().show === true ) 

  // reparent scene based on object in case it matches a primary (non-negating) selector 
  if( !firstFilter.value && firstFilter.show === true ){
    let obj 
    scene.traverse( (n) => hasName(n, firstFilter.key,firstFilter) && (obj = n) )
    if(obj){
      while( scene.children.length > 0 ) scene.children[0].removeFromParent()
      scene.add( obj )
    }
  }

  // then show/hide things based on secondary selectors
  frag.filters.map( (v) => {
    const filter  = v.filter.get()
    const name_or_tag = cleanupKey(v.fragment)
    let seen = {}

    const setVisibleUnseen = (m,visible) => {
      if( seen[m.uuid] ) return 
      m.visible = visible 
      seen[ m.uuid ] = true 
    }

    scene.traverse( (m) => {

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
      if( hasNameOrTag(m,name_or_tag,filter) ){
        m.visible   = filter.show
        if( filter.deep ) m.traverse( (n) => n.visible = m.visible )
      }
    })
  })

  return xrf.filter
}

