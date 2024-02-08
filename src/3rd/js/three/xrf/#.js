// this is called by navigator.js rather than by a URL e.g.

xrf.frag.defaultPredefinedViews = (opts) => {
  let {scene,model} = opts;
  scene.traverse( (n) => {
    if( n.userData && n.userData['#'] ){
      let frag = xrf.URI.parse( n.userData['#'] )
      if( !n.parent && document.location.hash.length < 2){
        xrf.navigator.to( n.userData['#'] )     // evaluate default XR fragments (global-level)
      }else{
        xrf.hashbus.pub( n.userData['#'], n )   // evaluate default XR fragments (node-level)
      }
    }
  })
}
