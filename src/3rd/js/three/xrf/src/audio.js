/*
 * mimetype: audio/aac 
 * mimetype: audio/mpeg 
 * mimetype: audio/ogg 
 * mimetype: audio/weba 
 * mimetype: audio/wav 
 */

let loadAudio = (mimetype) => function(url,opts){
  let {mesh,src,camera} = opts
  let {urlObj,dir,file,hash,ext} = xrf.parseUrl(url)
  let frag = xrf.URI.parse( url )

  /* WebAudio: setup context via THREEjs */
  if( !camera.listener ){
    camera.listener = new THREE.AudioListener();
	  camera.add( camera.listener );
  }

  let listener          = camera.listener 
  let isPositionalAudio = !(mesh.position.x == 0 && mesh.position.y == 0 && mesh.position.z == 0)
  const audioLoader = new THREE.AudioLoader();
  let sound = isPositionalAudio ? new THREE.PositionalAudio(listener) : new THREE.Audio(listener)
  audioLoader.load( url.replace(/#.*/,''), function( buffer ) {
    sound.setBuffer( buffer );
    sound.setLoop(true);
    sound.setVolume(0.5);
    sound.playXRF = (t) => {
      if( sound.isPlaying ) sound.stop()
      let hardcodedLoop = frag.t != undefined
      t = hardcodedLoop ? { ...frag.t, x: t.x} : t // override with hardcoded metadata except playstate (x)
      if( t && t.x != 0 ){
        // *TODO* https://stackoverflow.com/questions/12484052/how-can-i-reverse-playback-in-web-audio-api-but-keep-a-forward-version-as-well 
        sound.setPlaybackRate( Math.abs(t.x) ) // WebAudio does not support negative playback
        // setting loop
        sound.setLoop( t.z > 0 )
        // apply embedded audio/video samplerate/fps or global mixer fps
        let loopStart = hardcodedLoop ? t.y / buffer.sampleRate : t.y / xrf.model.mixer.loop.fps
        let loopEnd   = hardcodedLoop ? t.z / buffer.sampleRate : t.z / xrf.model.mixer.loop.fps
        let timeStart = loopStart > 0 ? loopStart : xrf.model.mixer.time

        if( t.y > 0 ) sound.setLoopStart( loopStart )
        if( t.z > 0 ) sound.setLoopEnd(   loopEnd   )
        if( t.x != 0 ){
          sound.offset = loopStart > 0 ? loopStart : timeStart
          sound.play()
        }
      }
    }
    mesh.add(sound)
    xrf.audio.push(sound)
  });
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

xrf.addEventListener('t', (opts) => {
  let t = opts.frag.t
  xrf.audio.map( (a) => a.playXRF(t) )
})
