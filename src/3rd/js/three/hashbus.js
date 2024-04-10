// the hashbus (QueryString eventBus) is mentioned in the spec 
//
// it allows metadata-keys ('foo' e.g.) of 3D scene-nodes (.userData.foo e.g.) to 
// react by executing code 

let pub = function( url, node_or_model, flags ){  // evaluate fragments in url
  if( !url ) return 
  if( !url.match(/#/) ) url = `#${url}`
  let { THREE, camera } = xrf
  let frag     = xrf.URI.parse( url, flags ).XRF
  let fromNode = node_or_model != xrf.model
  let isNode   = node_or_model && node_or_model.children

  let opts = {
    frag, 
    mesh:  fromNode ? node_or_model : xrf.camera, 
    model: xrf.model,
    camera: xrf.camera, 
    scene: isNode ? node_or_model : xrf.scene, 
    renderer: xrf.renderer,
    THREE: xrf.THREE, 
    hashbus: xrf.hashbus 
  }
  xrf.emit('hashbus',opts)
  .then( () => {
    for ( let k in frag ){
      let nodeAlias       = fromNode && opts.mesh && opts.mesh.userData && opts.mesh.userData[k] && opts.mesh.userData[k][0] == '#'
      if( nodeAlias ) pub(opts.mesh.userData[k], opts.mesh) // evaluate node alias
      else pub.fragment(k,opts)
    }
  })
  return frag
}

pub.fragment = (k, opts ) => { // evaluate one fragment
  let frag = opts.frag[k];

  let isPVorMediaFrag = frag.is( xrf.XRF.PV_EXECUTE ) || frag.is( xrf.XRF.T_MEDIAFRAG)
  if( !opts.skipXRWG && isPVorMediaFrag ) pub.XRWG(k,opts)

  // call native function (xrf/env.js e.g.), or pass it to user decorator
  xrf.emit(k,opts)
  .then( () => {
    let func = xrf.frag[k] || function(){} 
    if( typeof xrf[k] == 'function' ) xrf[k]( func, frag, opts)
    else func( frag, opts)
  })
}

pub.XRWG = (word,opts) => {
  let {frag,scene,model,renderer} = opts 

  // if this query was triggered by an src-value, lets filter it
  const isSRC = opts.embedded && opts.embedded.fragment == 'src'
  if( !isSRC ){                             // spec : https://xrfragment.org/#src

    let triggeredByMesh = opts.model != opts.mesh

    let v      = frag[word]
    let id     = v.is( xrf.XRF.T_DYNAMICKEY ) ? word : v.string || word 

    if( id == '#' || !id ) return
    let match = xrf.XRWG.match(id)

    if( !triggeredByMesh && (v.is( xrf.XRF.PV_EXECUTE ) || v.is( xrf.XRF.T_DYNAMIC)) && !v.is( xrf.XRF.T_DYNAMICKEYVALUE ) ){
      // evaluate global aliases or tag/objectnames
      match.map( (w) => {
        if( w.key == `#${id}` ){
          if(  w.value && w.value[0] == '#' ){
            // if value is alias, execute fragment value 
            xrf.hashbus.pub( w.value, xrf.model, xrf.XRF.METADATA | xrf.XRF.PV_OVERRIDE | xrf.XRF.NAVIGATOR )
          }
        }
      })
      xrf.emit('dynamicKey',{ ...opts,v,frag,id,match,scene })
    }else if( v.string ){
      // evaluate global aliases 
      xrf.emit('dynamicKeyValue',{ ...opts,v,frag,id,match,scene })
    }else{
      xrf.emit('dynamicKey',{ ...opts,v,frag,id,match,scene })
    }
  }
}


xrf.hashbus = { pub }
