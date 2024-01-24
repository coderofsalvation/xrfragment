xrf.frag.defaultPredefinedViews = (opts) => {
  let {scene,model} = opts;
  scene.traverse( (n) => {
    if( n.userData && n.userData['#'] ){
      let frag = xrf.URI.parse( n.userData['#'] )
      if( n.parent && n.parent.parent.isScene && document.location.hash.length < 2 ){
        xrf.navigator.to( n.userData['#'] )    // evaluate main scene XR fragments and update URL
      }else{
        xrf.hashbus.pub( n.userData['#'] )     // evaluate static XR fragments
      }
    }
  })
}
