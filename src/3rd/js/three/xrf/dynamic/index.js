xrf.frag.defaultPredefinedViews = (opts) => {
  let {scene,model} = opts;
  scene.traverse( (n) => {
    if( n.userData && n.userData['#'] ){
      let frag = xrf.URI.parse( n.userData['#'] )
      xrf.hashbus.pub( n.userData['#'] )          // evaluate static XR fragments
    }
  })
}

// react to enduser typing url
xrf.addEventListener('hash', (opts) => xrf.hashbus.pub( opts.hash ) )

// clicking href url with predefined view 
xrf.addEventListener('href', (opts) => {
  if( !opts.click || opts.xrf.string[0] != '#' ) return 
  xrf.hashbus.pub( opts.xrf.string )
}) 
