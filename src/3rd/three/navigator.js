xrf.navigator = {}

xrf.navigator.to = (url,event) => {
  debugger
  return new Promise( (resolve,reject) => {
    console.log("xrfragment: navigating to "+url)
    let {urlObj,dir,file,hash,ext} = xrf.parseUrl(url)
    if( xrf.model.file == file ) return resolve(xrf.model) // we're already loaded 
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
      xrf.navigator.commit( file, hash )
      resolve(model)
    })
  })
}

xrf.navigator.init = () => {
  if( xrf.navigator.init.inited ) return
  window.addEventListener('popstate', function (event){
    xrf.navigator.to( document.location.search.substr(1) + document.location.hash, event)
  })
  xrf.navigator.init.inited = true
}

xrf.navigator.commit = (file,hash) => {
  if( file == document.location.search.substr(1) ) return // page is in its default state
  window.history.pushState({},`${file}#${hash}`, document.location.pathname + `?${file}#${hash}` )
}
