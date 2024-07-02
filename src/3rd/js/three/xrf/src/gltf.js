// SPDX-FileCopyrightText: 2023 Leon van Kammen/NLNET
//
// SPDX-License-Identifier: MPL-2.0

/*
 * mimetype: model/gltf+json
 */

xrf.frag.src.type['gltf'] = function( url, opts ){
  return new Promise( (resolve,reject) => {
    let {mesh,src} = opts
    let URL = xrfragment.URI.toAbsolute( xrf.navigator.URI, url )
    let {directory,file,fileExt,URN} = URL;
    let loader

    const Loader = xrf.loaders[fileExt]
    if( !Loader ) throw 'xrfragment: no loader passed to xrfragment for extension .'+ext 
    loader = new Loader().setPath( URN )

    loader.load(file, (model) => {
      model.isSRC = true
      resolve(model)
    })
  })
}

