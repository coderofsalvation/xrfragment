// this is called by navigator.js rather than by a URL e.g.

xrf.frag.defaultPredefinedViews = (opts) => {
  let {scene,model} = opts;
  let defaultFragment;
  scene.traverse( (n) => {
    if( n.userData && n.userData['#'] ){
      if( n.isXRFRoot ){ 
        defaultFragment = n.userData['#']
      }
      xrf.hashbus.pub( n.userData['#'], n )   // evaluate default XR fragments without affecting URL
    }
  })
  return defaultFragment
}
