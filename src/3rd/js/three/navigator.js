xrf.navigator = {}

xrf.navigator.to = (url,event) => {
  if( !url ) throw 'xrf.navigator.to(..) no url given'
  return new Promise( (resolve,reject) => {
    let {urlObj,dir,file,hash,ext} = xrf.parseUrl(url)
    console.log("xrfragment: navigating to "+url)

    if( !file || xrf.model.file == file ){ // we're already loaded
      document.location.hash = `#${hash}`  // just update the hash
      xrf.eval( url, xrf.model )           // and eval local URI XR fragments 
      return resolve(xrf.model) 
    }

    if( xrf.model && xrf.model.scene ) xrf.model.scene.visible = false
    const Loader = xrf.loaders[ext]
    if( !Loader ) throw 'xrfragment: no loader passed to xrfragment for extension .'+ext 
    xrf.reset() // clear xrf objects from scene
    // force relative path 
    if( dir ) dir = dir[0] == '.' ? dir : `.${dir}`
    const loader = new Loader().setPath( dir )
    loader.load( file, function(model){
      model.file = file
      xrf.add( model.scene )
      xrf.model = model 
      xrf.eval( url, model )  // and eval URI XR fragments 
      xrf.navigator.pushState( `${dir}${file}`, hash )
      resolve(model)
    })
  })
}

xrf.navigator.init = () => {
  if( xrf.navigator.init.inited ) return
  window.addEventListener('popstate', function (event){
    xrf.navigator.to( document.location.search.substr(1) + document.location.hash, event)
  })
  xrf.navigator.material = {
    selection: new xrf.THREE.LineBasicMaterial({color:0xFF00FF,linewidth:2})
  }
  xrf.navigator.init.inited = true
}

xrf.navigator.pushState = (file,hash) => {
  if( file == document.location.search.substr(1) ) return // page is in its default state
  window.history.pushState({},`${file}#${hash}`, document.location.pathname + `?${file}#${hash}` )
}
