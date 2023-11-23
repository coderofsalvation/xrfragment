// the hashbus (QueryString eventBus) is mentioned in the spec 
//
// it allows metadata-keys ('foo' e.g.) of 3D scene-nodes (.userData.foo e.g.) to 
// react by executing code 

let pub = function( url, model, flags ){  // evaluate fragments in url
  if( !url ) return 
  if( !url.match(/#/) ) url = `#${url}`
  model = model || xrf.model
  let { THREE, camera } = xrf
  let frag = xrf.URI.parse( url, flags )
  let opts = {frag, mesh:xrf.camera, model, camera: xrf.camera, scene: xrf.scene, renderer: xrf.renderer, THREE: xrf.THREE, hashbus: xrf.hashbus }
  xrf.emit('hashbus',opts)
  .then( () => {
    for ( let k in frag ){
      pub.fragment(k,opts) 
    }
  })
  return frag
}

pub.mesh     = (mesh,model) => { // evaluate embedded fragments (metadata) inside mesh of model 
  if( mesh.userData ){
    let frag = {}
    for( let k in mesh.userData ) xrf.Parser.parse( k, mesh.userData[k], frag )
    for( let k in frag ){
      let opts = {frag, mesh, model, camera: xrf.camera, scene: model.scene, renderer: xrf.renderer, THREE: xrf.THREE, hashbus: xrf.hashbus }
      mesh.userData.XRF = frag // allow fragment impl to access XRF obj already
      xrf.emit('frag2mesh',opts)
      .then( () => pub.fragment(k,opts) )
    }
  }
}

pub.fragment = (k, opts ) => { // evaluate one fragment
  let frag = opts.frag[k];

  if( frag.is( xrf.XRF.PV_EXECUTE ) ) pub.XRWG({...opts,frag})

  // call native function (xrf/env.js e.g.), or pass it to user decorator
  xrf.emit(k,opts)
  .then( () => {
    let func = xrf.frag[k] || function(){} 
    if( typeof xrf[k] == 'function' ) xrf[k]( func, frag, opts)
    else func( frag, opts)
  })
}

pub.XRWG = (opts) => {
  let {frag,scene,model,renderer} = opts 
  console.dir(opts)

  // if this query was triggered by an src-value, lets filter it
  const isSRC = opts.embedded && opts.embedded.fragment == 'src'
  if( !isSRC ){                             // spec : https://xrfragment.org/#src
    for ( let i in frag  ) {
      let v = frag[i]
      let id = v.string || v.fragment
      if( id == '#' || !id ) return
      let match = xrf.XRWG.match(id)

      if( v.is( xrf.XRF.PV_EXECUTE ) ){
        scene.XRF_PV_ORIGIN = v.string
        // evaluate aliases 
        match.map( (w) => {
          if( w.key == `#${id}` ){
            if(  w.value && w.value[0] == '#' ){
              // if value is alias, execute fragment value 
              xrf.hashbus.pub( w.value, xrf.model, xrf.XRF.METADATA | xrf.XRF.PV_OVERRIDE | xrf.XRF.NAVIGATOR )
            }
          }
        })
        xrf.emit('dynamicKey',{ ...opts,v,frag,id,match,scene })
      }else{
        xrf.emit('dynamicKeyValue',{ ...opts,v,frag,id,match,scene })
      }
    }
  }
}


xrf.hashbus = { pub }
