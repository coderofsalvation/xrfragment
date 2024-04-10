
let loadHTML = (mimetype) => function(url,opts){
  let {mesh,src,camera} = opts
  let {urlObj,dir,file,hash,ext} = xrf.parseUrl(url)
  let frag = xrf.URI.parse( url ).XRF
  console.warn("todo: html viewer for src not implemented")
}

let htmlMimeTypes = [
  'text/html'
]
htmlMimeTypes.map( (mimetype) =>  xrf.frag.src.type[ mimetype ] = loadHTML(mimetype) )
