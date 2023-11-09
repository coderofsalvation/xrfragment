
let loadVideo = (mimetype) => function(url,opts){
  let {mesh,src,camera} = opts
  let {urlObj,dir,file,hash,ext} = xrf.parseUrl(url)
  const THREE = xrf.THREE
  let frag = xrf.URI.parse( url )

  let video = mesh.video = document.createElement('video')
  video.setAttribute("crossOrigin","anonymous")
  video.setAttribute("playsinline",'')
  video.addEventListener('loadedmetadata', function(){
    let texture = new THREE.VideoTexture( video );
    texture.colorSpace = THREE.SRGBColorSpace;
    let mat     = new xrf.THREE.MeshBasicMaterial()
    mat.map = texture
    mesh.material = mat
    // set range
    video.addEventListener('timeupdate', function timeupdate() {
      if (video.t && video.currentTime < video.t.y || video.currentTime >= video.y.z ) {
          vid.currentTime = video.t.y
      }
    },false)
  })

  video.src = url
  video.playXRF = (t) => {
    video.t = t
    if( t.x == 0 ) video.pause()
    else{
      video.playbackRate = Math.abs( t.x ) // html5 video does not support reverseplay :/
      video.play()
    }
    if( t.y != undefined ) video.time = t.y 
  }
}

let videoMimeTypes = [
  'video/ogg',
  'video/mp4'
]
videoMimeTypes.map( (mimetype) =>  xrf.frag.src.type[ mimetype ] = loadVideo(mimetype) )

// listen to t XR fragment changes
xrf.addEventListener('t', (opts) => {
  let t = opts.frag.t
  xrf.scene.traverse( (n) => n.video && (n.video.playXRF(t)) )
})
