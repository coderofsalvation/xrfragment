xrf.navigator = {URI:{}}

xrf.navigator.to = (url,flags,loader,data) => {
  if( !url ) throw 'xrf.navigator.to(..) no url given'

  let URI = xrfragment.URI.toAbsolute( xrf.navigator.URI, url )
  URI.hash          = xrf.navigator.reactifyHash(URI.hash)
  let fileChange    = URI.URN + URI.file != xrf.navigator.URI.URN + xrf.navigator.URI.file 
  let external      = URI.URN != document.location.origin + document.location.pathname 
  let hasPos        = URI.hash.pos 
  let hashChange    = String(xrf.navigator.URI.fragment||"") != String(URI.fragment||"")
  let hashbus       = xrf.hashbus
  xrf.navigator.URI = URI
  let {directory,file,fragment,fileExt} = URI;
  console.dir({URI, nav: xrf.navigator.URI})

  const evalFragment  = () => {
    if( URI.fragment ){
      hashbus.pub( URI.fragment, xrf.model, flags )     // eval local URI XR fragments 
      xrf.navigator.updateHash(fragment)                // which don't require 
    }
  }

  return new Promise( (resolve,reject) => {
    xrf
    .emit('navigate', {url,loader,data})
    .then( () => {

      const Loader = xrf.loaders[fileExt]

      if( fileExt && !loader ){  
        if( !Loader ) return resolve()
        loader = loader || new Loader().setPath( URI.URN )
      }

      if( !URI.fragment && !URI.file && !URI.fileExt ) return resolve(xrf.model) // nothing we can do here

      if( xrf.model && !fileChange && hashChange && !hasPos  ){
        evalFragment()
        return resolve(xrf.model)                         // positional navigation
      }

      xrf
      .emit('navigateLoading', {url,loader,data})
      .then( () => {
        if( (!fileChange || !file) && hashChange && hasPos ){                 // we're already loaded
          evalFragment()
          xrf.emit('navigateLoaded',{url})
          return resolve(xrf.model) 
        }
          
        // clear xrf objects from scene
        if( xrf.model && xrf.model.scene ) xrf.model.scene.visible = false
        xrf.reset() 

        // force relative path for files which dont include protocol or relative path
        if( directory ) directory = directory[0] == '.' || directory.match("://") ? directory : `.${directory}`

        loader = loader || new Loader().setPath( URI.URN )
        const onLoad = (model) => {

          model.file = URI.file
          // only change url when loading *another* file
          if( xrf.model ){
            xrf.navigator.pushState( external ? URI.URN + URI.file : URI.file, fragment )
          }
          //if( xrf.model ) xrf.navigator.pushState( `${ document.location.pathname != URI.directory ? URI.directory: ''}${URI.file}`, fragment )
          xrf.model = model 

          if( !model.isXRF ) xrf.parseModel(model,url.replace(directory,"")) // this marks the model as an XRF model

          if(xrf.debug ) model.animations.map( (a) => console.log("anim: "+a.name) )

          // spec: 1. generate the XRWG
          xrf.XRWG.generate({model,scene:model.scene})

          // spec: 2. init metadata inside model for non-SRC data
          if( !model.isSRC ){
            model.scene.traverse( (mesh) => xrf.parseModel.metadataInMesh(mesh,model) )
          }
          // spec: 1. execute the default predefined view '#' (if exist) (https://xrfragment.org/#predefined_view)
          xrf.frag.defaultPredefinedViews({model,scene:model.scene})
          // spec: predefined view(s) & objects-of-interest-in-XRWG from URI (https://xrfragment.org/#predefined_view)
          let frag = xrf.hashbus.pub( url, model) // and eval URI XR fragments 

          xrf.add( model.scene )
          if( fragment ) xrf.navigator.updateHash(fragment)
          xrf.emit('navigateLoaded',{url,model})
          resolve(model)
        }
  
        if( data ){  // file upload
          loader.parse(data, "", onLoad )
        }else{
          try{
            loader.load(file, onLoad )
          }catch(e){ 
            console.error(e)
            xrf.emit('navigateError',{url})
          }
        }
      })
    })
  })
}

xrf.navigator.init = () => {
  if( xrf.navigator.init.inited ) return

  xrf.navigator.URI = xrfragment.URI.parse(document.location.href)

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
    let {fileExt} = xrfragment.URI.parse(url)

    // handle http links
    if( url.match(/^http/) && !xrf.loaders[fileExt] ){
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
  console.log(`URI: ${document.location.search.substr(1)}#${hash}`)
  xrf.navigator.updateHash.active = true  // important to prevent recursion
  document.location.hash = hash
  xrf.navigator.updateHash.active = false
}

xrf.navigator.pushState = (file,hash) => {
  if( file == document.location.search.substr(1) ) return // page is in its default state
  window.history.pushState({},`${file}#${hash}`, document.location.pathname + `?${file}#${hash}` )
  xrf.emit('pushState', {file, hash} )
}

xrf.navigator.reactifyHash = ( obj ) => {
  return new Proxy(obj,{
    get(me,k)  { return me[k] },
    set(me,k,v){ 
      me[k] = v 
      xrf.navigator.to( "#" + this.toString(me) )
    },
    toString(me){
      let parts = []
      Object.keys(me).map( (k) => {
        parts.push( me[k] ? `${k}=${encodeURIComponent(me[k])}` : k ) 
      })
      return parts.join('&')
    }
  })
}
