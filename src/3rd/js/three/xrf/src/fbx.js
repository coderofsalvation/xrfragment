/*
 * mimetype: model/gltf+json
 */

xrf.frag.src.type['fbx'] = function( url, opts ){
  return new Promise( async (resolve,reject) => {
    let {mesh,src} = opts
    let URL  = xrfragment.URI.toAbsolute( xrf.navigator.URI, url )
    let frag = URL.XRF 
    let loader

    let {THREE}        = await import('https://unpkg.com/three@0.161.0/build/three.module.js')
    let  { FBXLoader } = await import('three/addons/loaders/FBXLoader.js')
    debugger

    //const Loader = xrf.loaders[ext]
    //if( !Loader ) throw 'xrfragment: no loader passed to xrfragment for extension .'+ext 
    //if( !dir.match("://") ){ // force relative path 
    //  dir = dir[0] == './' ? dir : `./${dir}`
    //  loader = new Loader().setPath( dir )
    //}else loader = new Loader()

    //loader.load(url, (model) => {
    //  model.isSRC = true
    //  resolve(model)
    //})
  })
}

