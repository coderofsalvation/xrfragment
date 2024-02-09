
let loadVideo = (mimetype) => function(url,opts){
  let {mesh,src,camera} = opts
  let {urlObj,dir,file,hash,ext} = xrf.parseUrl(url)
  const THREE = xrf.THREE
  let frag = xrf.URI.parse( url )

  mesh.media = mesh.media || {}

  let video = mesh.media.video = document.createElement('video')
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
      if (video.t && video.t.y !== undefined && video.t.y > video.t.x && Math.abs(video.currentTime) >= video.t.y ){
        if( video.looping ) video.currentTime = video.t.x // speed means loop
        else video.pause()
      }
    },false)
  })

  video.src = url
  video.speed = 1.0
  video.looping = false
  video.set = (mediafragment,v) => {
    video[mediafragment] = v

    if( mediafragment == 't'){
      video.pause()
      if( t.x !== undefined && t.x == t.y ) return // stop paused
      else{
        video.currentTime = t.x
        video.time = t.x
        video.play()
      }
    }
    if( mediafragment == 's' ){
      video.playbackRate = Math.abs( video.speed ) // html5 video does not support reverseplay :/
    }
  }
}

// stop playing audio when loading another scene
xrf.addEventListener('reset', () => {
  xrf.scene.traverse( (n)  => n.video && (n.video.playXRF({x:0,y:0})) && (n.video.remove()) )
})

let videoMimeTypes = [
  'video/ogg',
  'video/mp4'
]
videoMimeTypes.map( (mimetype) =>  xrf.frag.src.type[ mimetype ] = loadVideo(mimetype) )
