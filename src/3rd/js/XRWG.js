// the XRWG (XR WordGraph)is mentioned in the spec 
//
// it collects metadata-keys ('foo' e.g.), names and tags across 3D scene-nodes (.userData.foo e.g.) 

let XRWG = xrf.XRWG = []

XRWG.word = (key) => XRWG.find( (w) => w.word == word )

XRWG.cleankey = (word) => String(word).replace(/[^0-9\.a-zA-Z_]/g,'')
                                      .toLowerCase()
                                      .replace(/.*:\/\//,'')
XRWG.get = (v,k) => XRWG.find( (x) => x[ k || 'word'] == v )

XRWG.match = (str,types,level) => {
  if( XRWG.length == 0 ) XRWG.generate(xrf)
  level = level == undefined ? 1000 : level
  types = types || []
  let res = XRWG.filter( (n) => {
    types.map( (type) => n[type] ? n = false : false )
    return n
  })
  str = str.toLowerCase()
           .replace(/[!-\*]/g,'') // remove excludes and wildcards
  if( level  <10   ) res = res.filter( (n) => n.key    == str )
  if( level >=10   ) res = res.filter( (n) => n.word   == str   || n.key == str )
  if( level  >30   ) res = res.filter( (n) => n.word.match(str) || n.key == str )
  if( level  >40   ) res = res.filter( (n) => n.word.match(str) || n.key == str || String(n.value||'').match(str) )
  if( level  >999  ) res = res.filter( (n) => n.word.match(str) != null || n.key.match(str) != null || String(n.value||'').match(str) != null)
  return res
}

XRWG.generate = (opts) => {
  let {scene,model} = opts
  XRWG.slice(0,0) // empty  
    
  // collect words from 3d nodes

  let add = (key, spatialNode, type) => {
    if( !key || key.match(/(^#$|name)/) ) return
    let node = XRWG.get( XRWG.cleankey(key) )
    if( node ){
      node.types.push(type)
      node.nodes.push(spatialNode)
    }else{
      node = { word: XRWG.cleankey(key), key, nodes:[spatialNode], types:[] }
      if( spatialNode.userData[key] ) node.value = spatialNode.userData[key]
      node.types.push(type)
      xrf.emit('XRWGnode',node)
      XRWG.push( node )
    }
  }

  scene.traverse( (o) => {
    add( `#${o.name}`, o, 'name')
    for( let k in o.userData ){
      if( k == 'tag' ){
        let tagArr = o.userData.tag.split(" ")
                      .map(    (t) => t.trim() )
                      .filter( (t) => t )
                      .map(    (w) => add( w, o, 'tag') )
      }else if( k.match(/^(href|src)$/) ) add( o.userData[k], o, k)
      else if( k[0] == '#' ) add( k, o , 'pv')
      else add( k, o , 'query')
    }
  }) 

  // sort by n
  XRWG.sort( (a,b) => a.nodes.length - b.nodes.length )
  XRWG = XRWG.reverse() // the cleankey/get functions e.g. will persist
  xrf.emit('XRWG',XRWG)
}
