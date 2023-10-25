xrf.frag.defaultPredefinedView = (opts) => {
  let {scene,model} = opts;
  let frag = {}
  xrf.Parser.parse("#","",frag)
  xrf.frag.updatePredefinedView({frag,model,scene})
}

xrf.frag.updatePredefinedView = (opts) => {
  let {frag,scene,model,renderer} = opts 

  // if this query was triggered by an src-value, lets filter it
  const isSRC = opts.embedded && opts.embedded.fragment == 'src'
  if( !isSRC ){                             // spec : https://xrfragment.org/#src
    for ( let i in frag  ) {
      let v = frag[i]
      let id = v.string || v.fragment
      if( id == '#' || !id ) return
      let match = xrf.XRWG.match(id)

      if( v.is( xrf.XRF.PV_EXECUTE ) ){
        console.log("pv_execute")
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
        console.log("non pv_execute")
        xrf.emit('dynamicKeyValue',{ ...opts,v,frag,id,match,scene })
      }
    }
  }
}

// react to enduser typing url
xrf.addEventListener('hash', (opts) => {
  let frag = xrf.URI.parse( opts.hash )
  xrf.frag.updatePredefinedView({frag,scene:xrf.scene})
}) 

// clicking href url with predefined view 
xrf.addEventListener('href', (opts) => {
  if( !opts.click || opts.xrf.string[0] != '#' ) return 
  let frag = xrf.URI.parse( opts.xrf.string, xrf.XRF.NAVIGATOR | xrf.XRF.PV_OVERRIDE | xrf.XRF.METADATA )
  xrf.frag.updatePredefinedView({frag,scene:xrf.scene,href:opts.xrf})
}) 
