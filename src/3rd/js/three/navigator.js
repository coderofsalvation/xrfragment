xrf.navigator = {}

xrf.navigator.to = (url,flags,loader,data) => {
  if( !url ) throw 'xrf.navigator.to(..) no url given'

  let hashbus = xrf.hashbus
  xrf.emit('navigate', {url,loader,data})

  return new Promise( (resolve,reject) => {
    let {urlObj,dir,file,hash,ext} = xrf.parseUrl(url)
    if( !file || (!data && xrf.model.file == file) ){ // we're already loaded
      hashbus.pub( url, xrf.model, flags )    // and eval local URI XR fragments 
      xrf.navigator.updateHash(hash)
      return resolve(xrf.model) 
    }

    if( xrf.model && xrf.model.scene ) xrf.model.scene.visible = false
    if( !loader ){  
      const Loader = xrf.loaders[ext]
      if( !Loader ) throw 'xrfragment: no loader passed to xrfragment for extension .'+ext 
      loader = loader || new Loader().setPath( dir )
    }

    // force relative path 
    if( dir ) dir = dir[0] == '.' ? dir : `.${dir}`
    url = url.replace(dir,"")
    loader = loader || new Loader().setPath( dir )
    const onLoad = (model) => {
      xrf.reset() // clear xrf objects from scene
      model.file = file
      // only change url when loading *another* file
      if( xrf.model ) xrf.navigator.pushState( `${dir}${file}`, hash )
      xrf.model = model 
      // spec: 1. generate the XRWG
      xrf.XRWG.generate({model,scene:model.scene})
      // spec: 1. execute the default predefined view '#' (if exist) (https://xrfragment.org/#predefined_view)
      xrf.frag.defaultPredefinedViews({model,scene:model.scene})
      // spec: 2. init metadata
      // spec: predefined view(s) from URL (https://xrfragment.org/#predefined_view)
      setTimeout( () => { // give external objects some slack 
        let frag = hashbus.pub( url, model) // and eval URI XR fragments 
        hashbus.pub.XRWG({model,scene:model.scene,frag})
      },2000)
      xrf.add( model.scene )
      xrf.navigator.updateHash(hash)
      xrf.emit('navigateLoaded',{url,model})
      resolve(model)
    }

    if( data ) loader.parse(data, "", onLoad )
    else       loader.load(url, onLoad )
  })
}

xrf.navigator.init = () => {
  if( xrf.navigator.init.inited ) return

  window.addEventListener('popstate', function (event){
    xrf.navigator.to( document.location.search.substr(1) + document.location.hash )
  })
  
  window.addEventListener('hashchange', function (e){
    xrf.emit('hash', {hash: document.location.hash })
  })

  // this allows selectionlines to be updated according to the camera (renderloop)
  xrf.focusLine = new xrf.THREE.Group()
  xrf.focusLine.material = new xrf.THREE.LineDashedMaterial({color:0xFF00FF,linewidth:3, scale: 1, dashSize: 0.2, gapSize: 0.1,opacity:0.3, transparent:true})
  xrf.focusLine.isXRF = true
  xrf.focusLine.position.set(0,0,-0.5);
  xrf.focusLine.points = []
  xrf.focusLine.lines  = []
  xrf.camera.add(xrf.focusLine)

  xrf.navigator.init.inited = true
}

xrf.navigator.updateHash = (hash,opts) => {
  if( hash.replace(/^#/,'') == document.location.hash.substr(1) || hash.match(/\|/) ) return  // skip unnecesary pushState triggers
  console.log(`URL: ${document.location.search.substr(1)}#${hash}`)
  document.location.hash = hash
  xrf.emit('hash', {...opts, hash: `#${hash}` })
}

xrf.navigator.pushState = (file,hash) => {
  if( file == document.location.search.substr(1) ) return // page is in its default state
  window.history.pushState({},`${file}#${hash}`, document.location.pathname + `?${file}#${hash}` )
  xrf.emit('pushState', {file, hash} )
}
