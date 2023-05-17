xrf.navigator = {}

xrf.navigator.to = (url) => {
  return new Promise( (resolve,reject) => {
    console.log("xrfragment: navigating to "+url)
    let {urlObj,dir,file,hash,ext} = xrf.parseUrl(url)
    if( xrf.model && xrf.model.scene ) xrf.model.scene.visible = false
    console.log("ext="+ext)
    const Loader = xrf.loaders[ext]
    if( !Loader ) throw 'xrfragment: no loader passed to xrfragment for extension .'+ext 
    // force relative path 
    if( dir ) dir = dir[0] == '.' ? dir : `.${dir}`
    const loader = new Loader().setPath( dir )
    loader.load( file, function(model){
      xrf.reset()
      model.scene.xrf = true // leave mark for reset()
      xrf.scene.add( model.scene )
      xrf.model = model 
      xrf.navigator.commit( file, hash )
      resolve(model)
    })
  })
}

xrf.navigator.init = () => {
  if( xrf.navigator.init.inited ) return
  window.addEventListener('popstate', function (event){
    console.log(event.target.document.location.search)
    console.log(event.currentTarget.document.location.search)
    console.log(document.location.search)
    xrf.navigator.to( document.location.search.substr(1) + document.location.hash )
  })
  let {url,urlObj,dir,file,hash,ext} = xrf.parseUrl(document.location.href)
  //console.dir({file,hash})
  xrf.navigator.commit(file,document.location.hash)
  xrf.navigator.init.inited = true
}

xrf.navigator.commit = (file,hash) => {
  console.log("hash="+hash)
  window.history.pushState({},null, document.location.pathname + `?${file}#${hash}` )
}
