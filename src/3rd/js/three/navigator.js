xrf.navigator = {}

xrf.navigator.to = (url,flags,loader,data) => {
  if( !url ) throw 'xrf.navigator.to(..) no url given'
  let {urlObj,dir,file,hash,ext} = xrf.parseUrl(url)
  let hashChange = (!file && hash) || !data && xrf.model.file == file
  let hasPos     = String(hash).match(/pos=/)


  let hashbus = xrf.hashbus

  return new Promise( (resolve,reject) => {
    xrf
    .emit('navigate', {url,loader,data})
    .then( () => {

      if( ext && !loader ){  
        const Loader = xrf.loaders[ext]
        if( !Loader ) return resolve()
        loader = loader || new Loader().setPath( dir )
      }

      if( !hash && !file && !ext ) return resolve(xrf.model) // nothing we can do here

      if( hashChange && !hasPos ){
        hashbus.pub( url, xrf.model, flags )     // eval local URI XR fragments 
        xrf.navigator.updateHash(hash)           // which don't require 
        return resolve(xrf.model)                // positional navigation
      }

      xrf
      .emit('navigateLoading', {url,loader,data})
      .then( () => {
        if( hashChange && hasPos ){                 // we're already loaded
          hashbus.pub( url, xrf.model, flags )     // and eval local URI XR fragments 
          xrf.navigator.updateHash(hash)
          xrf.emit('navigateLoaded',{url})
          return resolve(xrf.model) 
        }
          
        // clear xrf objects from scene
        if( xrf.model && xrf.model.scene ) xrf.model.scene.visible = false
        xrf.reset() 

        // force relative path for files which dont include protocol or relative path
        if( dir ) dir = dir[0] == '.' || dir.match("://") ? dir : `.${dir}`
        url = url.replace(dir,"")
        loader = loader || new Loader().setPath( dir )
        const onLoad = (model) => {

          model.file = file
          // only change url when loading *another* file
          if( xrf.model ) xrf.navigator.pushState( `${dir}${file}`, hash )
          xrf.model = model 
          if(xrf.debug ) model.animations.map( (a) => console.log("anim: "+a.name) )
          // spec: 2. init metadata inside model for non-SRC data
          if( !model.isSRC ){ 
            model.scene.traverse( (mesh) => xrf.hashbus.pub.mesh(mesh,model) )
          }
          // spec: 1. generate the XRWG
          xrf.XRWG.generate({model,scene:model.scene})

          // spec: 1. execute the default predefined view '#' (if exist) (https://xrfragment.org/#predefined_view)
          xrf.frag.defaultPredefinedViews({model,scene:model.scene})
          // spec: predefined view(s) & objects-of-interest-in-XRWG from URL (https://xrfragment.org/#predefined_view)
          let frag = xrf.hashbus.pub( url, model) // and eval URI XR fragments 

          xrf.add( model.scene )
          if( hash ) xrf.navigator.updateHash(hash)
          xrf.emit('navigateLoaded',{url,model})
          resolve(model)
        }

        if( data ){  // file upload
          loader.parse(data, "", onLoad )
        }else loader.load(url, onLoad )
      })
    })
  })
}

xrf.navigator.init = () => {
  if( xrf.navigator.init.inited ) return

  window.addEventListener('popstate', function (event){
    if( !xrf.navigator.updateHash.active ){ // ignore programmatic hash updates (causes infinite recursion)
      xrf.navigator.to( document.location.search.substr(1) + document.location.hash )
    }
  })
  
  window.addEventListener('hashchange', function (e){
    xrf.emit('hash', {hash: document.location.hash })
  })

  xrf.navigator.setupNavigateFallbacks()

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

xrf.navigator.setupNavigateFallbacks = () => {

  xrf.addEventListener('navigate', (opts) => {
    let {url} = opts
    let {urlObj,dir,file,hash,ext} = xrf.parseUrl(url)
    // handle http links
    if( url.match(/^http/) && !xrf.loaders[ext] ){
      let inIframe
      try { inIframe = window.self !== window.top; } catch (e) { inIframe = true; }
      return inIframe ? window.parent.postMessage({ url }, '*') : window.open( url, '_blank')
      // in case you're running in an iframe, then use this in the parent page:
      //
      // window.addEventListener("message", (e) => {
      //   if (e.data && e.data.url){
      //     window.open( e.data.url, '_blank')
      //   }
      // },
      //   false,
      // );
    }
  })

}

xrf.navigator.updateHash = (hash,opts) => {
  if( hash.replace(/^#/,'') == document.location.hash.substr(1) || hash.match(/\|/) ) return  // skip unnecesary pushState triggers
  console.log(`URL: ${document.location.search.substr(1)}#${hash}`)
  xrf.navigator.updateHash.active = true  // important to prevent recursion
  document.location.hash = hash
  xrf.navigator.updateHash.active = false
}

xrf.navigator.pushState = (file,hash) => {
  if( file == document.location.search.substr(1) ) return // page is in its default state
  window.history.pushState({},`${file}#${hash}`, document.location.pathname + `?${file}#${hash}` )
  xrf.emit('pushState', {file, hash} )
}
