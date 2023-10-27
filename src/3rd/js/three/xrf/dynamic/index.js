xrf.frag.defaultPredefinedViews = (opts) => {
  let {scene,model} = opts;
  scene.traverse( (n) => {
    if( n.userData && n.userData['#'] ){
      let frag = xrf.URI.parse( n.userData['#'] )
      xrf.hashbus.pub.XRWG({frag,model,scene})
    }
  })
}

// react to enduser typing url
xrf.addEventListener('hash', (opts) => {
  let frag = xrf.URI.parse( opts.hash )
  xrf.hashbus.pub.XRWG({frag,scene:xrf.scene})
}) 

// clicking href url with predefined view 
xrf.addEventListener('href', (opts) => {
  if( !opts.click || opts.xrf.string[0] != '#' ) return 
  let frag = xrf.URI.parse( opts.xrf.string, xrf.XRF.NAVIGATOR | xrf.XRF.PV_OVERRIDE | xrf.XRF.METADATA )
  xrf.hashbus.pub.XRWG({frag,scene:xrf.scene,href:opts.xrf})
}) 
