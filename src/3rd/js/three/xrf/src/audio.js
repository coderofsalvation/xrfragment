/*
 * mimetype: audio/aac 
 * mimetype: audio/mpeg 
 * mimetype: audio/ogg 
 * mimetype: audio/weba 
 * mimetype: audio/wav 
 */

let loadAudio = (mimetype) => function(url,opts){
  let {mesh} = opts
  let {urlObj,dir,file,hash,ext} = xrf.parseUrl(url)

  // global audio
  if( mesh.position.x == 0 && mesh.position.y == 0 && mesh.position.z == 0 ){
    let audio = window.document.createElement('audio')
    // init fallback formats
    let fallback  = ['mp3','ogg','wav','weba','aac']
    let addSource = (ext) => {
      const src     = window.document.createElement('source')
      src.setAttribute("src", url)
      src.setAttribute("type",mimetype)
      audio.appendChild(src)
    }
    fallback
    .filter( (e) => e != ext )
    .map( addSource )
    document.body.appendChild(audio)
    xrf.audio.push(audio)
  }
}

let audioMimeTypes = [
  'audio/wav',
  'audio/mpeg',
  'audio/weba',
  'audio/aac',
  'audio/ogg',
  'application/ogg'
]
audioMimeTypes.map( (mimetype) =>  xrf.frag.src.type[ mimetype ] = loadAudio(mimetype) )

// *TODO* https://www.svgrepo.com/svg/20195/play-button should trigger play?
