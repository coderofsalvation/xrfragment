xrf.navigator = {}

xrf.navigator.to = (url,flags) => {
  if( !url ) throw 'xrf.navigator.to(..) no url given'

  return new Promise( (resolve,reject) => {
    let {urlObj,dir,file,hash,ext} = xrf.parseUrl(url)
    console.log(url)

    if( !file || xrf.model.file == file ){ // we're already loaded
      xrf.eval( url, xrf.model, flags )    // and eval local URI XR fragments 
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
      // only change url when loading *another* file
      if( xrf.model ) xrf.navigator.pushState( `${dir}${file}`, hash )
      xrf.model = model 
      xrf.eval( '#', model )     // execute the default projection '#' (if exist)
      xrf.eval( url, model )     // and eval URI XR fragments 
      if( !hash.match(/pos=/) ) 
        xrf.eval( '#pos=0,0,0' ) // set default position if not specified
      resolve(model)
    })
  })
}

xrf.navigator.init = () => {
  if( xrf.navigator.init.inited ) return
  window.addEventListener('popstate', function (event){
    xrf.navigator.to( document.location.search.substr(1) + document.location.hash )
  })
  xrf.navigator.material = {
    selection: new xrf.THREE.LineBasicMaterial({color:0xFF00FF,linewidth:2})
  }
  xrf.navigator.init.inited = true
}

xrf.navigator.updateHash = (hash) => {
  if( hash == document.location.hash || hash.match(/\|/) ) return  // skip unnecesary pushState triggers
  document.location.hash = hash
  xrf.emit('updateHash', {hash} )
}

xrf.navigator.pushState = (file,hash) => {
  if( file == document.location.search.substr(1) ) return // page is in its default state
  window.history.pushState({},`${file}#${hash}`, document.location.pathname + `?${file}#${hash}` )
}
