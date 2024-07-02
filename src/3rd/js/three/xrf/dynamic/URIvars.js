// SPDX-FileCopyrightText: 2023 Leon van Kammen/NLNET
//
// SPDX-License-Identifier: MPL-2.0

// this holds all the URI Template variables (https://www.rfc-editor.org/rfc/rfc6570)

xrf.addEventListener('parseModel', (opts) => {
  let {model,url,file} = opts
  if( model.isSRC || opts.isSRC ) return // ignore SRC models

  xrf.URI.vars = new Proxy({},{
    set(me,k,v){ 
      if( k.match(/^(name)$/) ) return true
      me[k] = v 
      return true
    },
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
    const variables = /{([a-zA-Z0-9-]+)}/g

    if( n.userData ){
      for( let i in n.userData ){
        if( i[0] == '#' || i.match(/^(href|tag)$/) ) continue // ignore XR Fragment aliases
        if( i == 'src' ){
          // lets declare empty variables found in src-values ('https://foo.com/video.mp4#{somevar}') e.g.
          if( n.userData[i].match(variables) ){
            let vars = [].concat( n.userData[i].match(variables) )
            const strip = (v) => v.replace(/[{}]/g,'')
            vars.map( (v) => xrf.URI.vars[ strip(v) ] = () => '' )
          }
        }else xrf.URI.vars[i] = () => n.userData[i] // declare variables with values
      }
    }
  })

})


xrf.addEventListener('dynamicKeyValue', (opts) => {
  // select active camera if any
  let {id,match,v} = opts

  if( !v.is( xrf.XRF.CUSTOMFRAG) ) return // only process custom frags from here
  if( v.string.match(/(<|>)/) )    return // ignore filter values
   
  if( match.length > 0 ){
    xrf.frag.dynamic.material(v,opts) // check if fragment is an objectname
  }
  
  if( !xrf.URI.vars[ v.string ] )           return console.error(`'${v.string}' metadata-key not found in scene`)        
  //if( xrf.URI.vars[ id ] && !match.length ) return console.error(`'${id}'       object/tag/metadata-key not found in scene`)

  if( xrf.debug ) console.log(`URI.vars[${id}]='${v.string}'`)

  if( xrf.URI.vars[id] ){
    xrf.URI.vars[ id ] = xrf.URI.vars[ v.string ]     // update var
    xrf.scene.traverse( (n) => {                      
      // re-expand src-values which use the updated URI Template var 
      if( n.userData && n.userData.src && n.userData.srcTemplate && n.userData.srcTemplate.match(`{${id}}`) ){
        let srcNewFragments = xrf.frag.src.expandURI( n ).replace(/.*#/,'')
        console.log(`URI.vars[${id}] => updating ${n.name} => ${srcNewFragments}`)
        let frag = xrf.hashbus.pub( srcNewFragments, n )
      }
    })
  }else{
    xrf.XRWG.deepApplyMatch(match, v, (match,v,node,type) => {
      console.log(v.string)
      if( node.geometry ) xrf.hashbus.pub( xrf.URI.vars[ v.string ](), node) // apply fragment mesh(es)
    })
  }

})
