// this allows surfing to a href by typing its node-name 

// help screen
document.addEventListener('chat.command.help', (e) => {
  e.detail.message += `
    <br><b class="badge">/speak_keyboard &lt;true|false&gt;</b> turn on/off keyboard input TTS
    <br><b class="badge">/speak_teleports &lt;true|false&gt;</b> turn on/off TTS for teleports
    <br><b class="badge">/speak_rate &lt;1&gt;</b> adjust TTS speed
    <br><b class="badge">/speak_pitch &lt;1&gt;</b> adjust TTS pitch
    <br><b class="badge">/speak_volume &lt;1&gt;</b> adjust TTS volume
    <br><b class="badge">/speak_voice &lt;0&gt;</b> select voice (max: ${window.accessibility.speak_voices})
  ` 
})
        
document.addEventListener('chat.command', (e) => {
  if( !e.detail.message.trim().match(/ /) ) return 
  let action = e.detail.message.trim().split(" ")[0]
  let value  = e.detail.message.trim().split(" ")[1]

  if( window.accessibility[action] == undefined ) return

  window.accessibility[action] = value
  window.localStorage.setItem(action, value )
  $chat.send({message: `${action} set to ${value}`, class:['info']})

})
