// this allows surfing to a href by typing its node-name 

// help screen
document.addEventListener('chat.command.help', (e) => {
  e.detail.message += `
    <br><b class="badge">&lt;destinationname&gt;</b> surf to a destination
  ` 
})
        
document.addEventListener('chat.input', (e) => {

  let name = e.detail.message.trim()
  xrf.scene.traverse( (n) => {
    if( n.userData && n.userData.href && n.userData.href.match(/pos=/) && n.name == name ){
      $chat.send({message:'<b class="badge">activating</b> '+n.name, class:['self','info']})
      xrf.navigator.to( n.userData.href )
    }
  })

})
