/*
 * mimetype: audio/aac 
 * mimetype: audio/mpeg 
 * mimetype: audio/ogg 
 * mimetype: audio/weba 
 * mimetype: audio/wav 
 */

let loadAudio = (mimetype) => function(url,opts){
  let {mesh,src,camera,THREE} = opts
  let {urlObj,dir,file,hash,ext} = xrf.parseUrl(url)
  let frag = xrf.URI.parse( url )

  xrf.init.audio()
  let isPositionalAudio = !(mesh.position.x == 0 && mesh.position.y == 0 && mesh.position.z == 0)
  const audioLoader = new THREE.AudioLoader();
  let sound = isPositionalAudio ? new THREE.PositionalAudio( camera.listener) 
                                : new THREE.Audio( camera.listener )

  mesh.media = mesh.media || {}
  mesh.media.audio = { set: (mediafragment,v) => mesh.media.audio[mediafragment] = v }

  audioLoader.load( url.replace(/#.*/,''), function( buffer ) {

    sound.setBuffer( buffer );
    sound.setLoop(false);
    sound.setVolume( 1.0 )
    if( isPositionalAudio ){
      sound.setRefDistance( mesh.scale.x);
      sound.setRolloffFactor(20.0)
      //sound.setDirectionalCone( 360, 360, 0.01 );
    }else sound.setVolume( mesh.scale.x )

    mesh.add(sound)

    sound.set = (mediafragment,v) => {
      try{
        sound[mediafragment] = v 

        if( mediafragment == 't'){

          if( sound.isPlaying && v.y != undefined && v.x == v.y ){
            sound.offset = v.x * buffer.sampleRate ;
            sound.pause()
            return 
          }else sound.stop()

          // apply embedded audio/video samplerate/fps or global mixer fps
          sound.setLoopStart(v.x);
          sound.setLoopEnd(v.y || buffer.duration);
          sound.offset = v.x;
          sound.play()
        }

        if( mediafragment == 's'){
          // *TODO* https://stackoverflow.com/questions/12484052/how-can-i-reverse-playback-in-web-audio-api-but-keep-a-forward-version-as-well 
          sound.pause()
          sound.setPlaybackRate( Math.abs(v.x) ) // WebAudio does not support negative playback
          sound.play()
        }

        if( mediafragment == 'loop'){
          sound.pause()
          sound.setLoop( v.loop )
          sound.play()
        }
      }catch(e){ console.warn(e) }
    }

    let lazySet = {}
    let mediaFragments = ['t','loop','s']
    mediaFragments.map( (f) => mesh.media.audio[f] && (lazySet[f] = mesh.media.audio[f]) )
    mesh.media.audio = sound

    // autoplay if user already requested play (before the sound was loaded)
    mediaFragments.map( (f) => {
      if( lazySet[f] ) mesh.media.audio.set(f, lazySet[f] )
    })

  });

  // apply Media fragments from URL 
  (['t','loop','s']).map( (f) => { 
    if( frag[f] ){
      mesh.media.audio.set( f, frag[f] )
    }
  })

}

xrf.init.audio = (opts) => {
  let camera = xrf.camera
  /* WebAudio: setup context via THREEjs */
  if( !camera.listener ){
    camera.listener = new THREE.AudioListener();
    // *FIXME* camera vs camerarig conflict
    (camera.getCam ? camera.getCam() : camera).add( camera.listener );
    xrf.emit('audioInited',{listener:camera.listener, ...opts})
  }
}
xrf.addEventListener('init', xrf.init.audio )

// stop playing audio when loading another scene
xrf.addEventListener('reset', () => {
  xrf.scene.traverse( (n)  => {
    if( n.media && n.media.audio ){
      if( n.media.audio.stop ) n.media.audio.stop()
      if( n.media.audio.remove ) n.media.audio.remove()
    }
  })
})



let audioMimeTypes = [
  'audio/x-wav',
  'audio/wav',
  'audio/mpeg',
  'audio/mp3',
  'audio/weba',
  'audio/aac',
  'application/ogg'
]
audioMimeTypes.map( (mimetype) =>  xrf.frag.src.type[ mimetype ] = loadAudio(mimetype) )
