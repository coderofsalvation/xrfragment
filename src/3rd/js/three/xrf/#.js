// this is called by navigator.js rather than by a URL e.g.

xrf.frag.defaultPredefinedViews = (opts) => {
  let {scene,model} = opts;
  scene.traverse( (n) => {
    if( n.userData && n.userData['#'] ){
      xrf.hashbus.pub( n.userData['#'], n )   // evaluate default XR fragments without affecting URL
    }
  })
}
