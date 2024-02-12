
// this holds all the URI Template variables (https://www.rfc-editor.org/rfc/rfc6570)

xrf.addEventListener('parseModel', (opts) => {
  let {model,url,file} = opts
  if( model.isSRC || opts.isSRC ) return // ignore SRC models
  xrf.URI.vars = new Proxy({},{
    set(me,k,v){ me[k] = v },
    get(me,k  ){ 
      if( k == '__object' ){
        let obj = {}
        for( let i in xrf.URI.vars ) obj[i] = xrf.URI.vars[i]()
        return obj
      }
      return me[k] 
    },
  })

  model.scene.traverse( (n) => {
    if( n.userData ){
      for( let i in n.userData ){
        if( i[0] == '#' || i.match(/^(href|src|tag)$/) ) continue // ignore XR Fragment aliases
        xrf.URI.vars[i] = () => n.userData[i]
      }
    }
  })

})


xrf.addEventListener('dynamicKeyValue', (opts) => {
  // select active camera if any
  let {id,match,v} = opts

  if( !v.is( xrf.XRF.CUSTOMFRAG) ) return // only process custom frags from here

  // check if fragment is an objectname
  if( match.length > 0 ){
    xrf.frag.dynamic.material(v,opts)
  }else{
    if( !xrf.URI.vars[ v.string ] ) return console.warn(`'${v.string}' metadata not found in scene`)            // only assign to known values
    xrf.URI.vars[ id ] = xrf.URI.vars[ v.string ]     // update var
    if( xrf.debug ) console.log(`URI.vars[${id}]='${v.string}'`)

    xrf.scene.traverse( (n) => {                      // reflect new changes
      if( n.userData && n.userData.src && n.userData.srcTemplate && n.userData.srcTemplate.match(`{${id}}`) ){
        let srcNewFragments = xrf.frag.src.expandURI( n ).replace(/.*#/,'')
        console.log(`URI.vars[${id}] => updating ${n.name} => ${srcNewFragments}`)
        let frag = xrf.hashbus.pub( srcNewFragments, n )
      }
    })
  }
})
