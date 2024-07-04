// SPDX-FileCopyrightText: 2023 Leon van Kammen/NLNET
//
// SPDX-License-Identifier: MPL-2.0

let loadVideo = (mimetype) => function(url,opts){
  let {mesh,src,camera} = opts
  const THREE = xrf.THREE
  let URL  = xrfragment.URI.toAbsolute( xrf.navigator.URI, url )
  let frag = URL.XRF 

  // patch VideoTexture so it doesn't upload videoframes when paused
  // https://github.com/mrdoob/three.js/pull/28575 
  THREE.VideoTexture.prototype.update = function(){
    const video = this.image;
    const hasVideoFrameCallback = 'requestVideoFrameCallback' in video;

    if ( hasVideoFrameCallback === false && video.readyState >= video.HAVE_CURRENT_DATA && (!video.paused || !this.firstFrame) ){
      console.log("updating..")
      this.needsUpdate = true;
      this.firstFrame  = true
    }
  }


  mesh.media = mesh.media || {}

  let video = mesh.media.video = document.createElement('video')
  video.style.display = 'none'
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

  video.src = URL.URN + URL.file 
  video.speed = 1.0
  video.looping = false
  video.set = (mediafragment,v) => {
    video[mediafragment] = v

    if( mediafragment == 't'){
      video.pause()
      if( v.x !== undefined && v.x == v.y ) return // stop paused
      else{
        video.currentTime = v.x
        video.time = v.x
        video.play()
      }
    }
    if( mediafragment == 's' ){
      video.playbackRate = Math.abs( v.x ) // html5 video does not support reverseplay :/
    }
    if( mediafragment == 'loop' ){
      video.looping = true 
    }
  }
}

// stop playing audio when loading another scene
xrf.addEventListener('reset', () => {
  xrf.scene.traverse( (n)  => n.media && n.media.video && (n.media.video.pause()) && (n.media.video.remove()) )
})

let videoMimeTypes = [
  'video/ogg',
  'video/mp4'
]
videoMimeTypes.map( (mimetype) =>  xrf.frag.src.type[ mimetype ] = loadVideo(mimetype) )
