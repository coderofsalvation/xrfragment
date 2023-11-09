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

  /* WebAudio: setup context via THREEjs */
  if( !camera.listener ){
    camera.listener = new THREE.AudioListener();
    // *FIXME* camera vs camerarig conflict
	  (camera.getCam ? camera.getCam() : camera).add( camera.listener );
  }

  let isPositionalAudio = !(mesh.position.x == 0 && mesh.position.y == 0 && mesh.position.z == 0)
  const audioLoader = new THREE.AudioLoader();
  let sound = isPositionalAudio ? new THREE.PositionalAudio( camera.listener) 
                                : new THREE.Audio( camera.listener )

  audioLoader.load( url.replace(/#.*/,''), function( buffer ) {

    sound.setBuffer( buffer );
    sound.setLoop(false);
    sound.setVolume(1.0);
    if( isPositionalAudio ){
      sound.setRefDistance( mesh.scale.x);
      sound.setRolloffFactor(20.0)
      //sound.setDirectionalCone( 360, 360, 0.01 );
    }

    sound.playXRF = (t) => {

      if( sound.isPlaying && t.y != undefined ) sound.stop()
      if( sound.isPlaying && t.y == undefined ) sound.pause()

      let hardcodedLoop = frag.t != undefined
      t = hardcodedLoop ? { ...frag.t, x: t.x} : t // override with hardcoded metadata except playstate (x)
      if( t && t.x != 0 ){
        // *TODO* https://stackoverflow.com/questions/12484052/how-can-i-reverse-playback-in-web-audio-api-but-keep-a-forward-version-as-well 
        t.x = Math.abs(t.x)
        sound.setPlaybackRate( t.x ) // WebAudio does not support negative playback
        // setting loop
        if( t.z ) sound.setLoop( true )
        // apply embedded audio/video samplerate/fps or global mixer fps
        let loopStart = hardcodedLoop ? t.y : t.y * buffer.sampleRate;
        let loopEnd   = hardcodedLoop ? t.z : t.z * buffer.sampleRate;
        let timeStart = loopStart > 0 ? loopStart : (t.y == undefined ? xrf.model.mixer.time : t.y)

        if( t.z > 0 ) sound.setLoopEnd(   loopEnd   )
        if( t.y != undefined ){ 
          console.dir({loopStart,t})
          sound.setLoopStart( loopStart )
          sound.offset = loopStart 
        }
        sound.play()
      }
    }
    mesh.add(sound)
  });

  mesh.audio = sound
}

let audioMimeTypes = [
  'audio/wav',
  'audio/mpeg',
  'audio/mp3',
  'audio/weba',
  'audio/aac',
  'application/ogg'
]
audioMimeTypes.map( (mimetype) =>  xrf.frag.src.type[ mimetype ] = loadAudio(mimetype) )

// listen to t XR fragment changes
xrf.addEventListener('t', (opts) => {
  let t = opts.frag.t
  xrf.scene.traverse( (n) => n.audio && n.audio.playXRF && (n.audio.playXRF(t)) )
})
