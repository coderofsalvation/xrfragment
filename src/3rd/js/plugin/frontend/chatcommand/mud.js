// this allows a more-or-less MUD type interface
//
//


// help screen
document.addEventListener('chat.command.help', (e) => {
  e.detail.message += `
    <br><b class="badge">?</b> help screen
    <br><b class="badge">look</b> view scene and destinations 
    <br><b class="badge">go [left|right|forward|destination]</b> surf [to destination]
    <br><b class="badge">do [action]</b> list [or perform] action(s)
    <br><b class="badge">rotate &lt;left|right|up|down&gt;</b> rotate camera
    <br><b class="badge">back</b> go to previous portal/link 
    <br><b class="badge">forward</b> go to previous portal/link 
    <br><b class="badge">#....</b> execute XR Fragments 
    <hr/>
  ` 
})

const listExits = (scene) => {
  let message = ''
  let destinations = {}
  scene.traverse( (n) => {
    if( n.userData && n.userData.href && n.userData.href.match(/pos=/) ){
      destinations[n.name] = n.userData['aria-label'] || n.userData.href
    } 
  })
  for( let destination in destinations ){
    message += `<br><b class="badge">${destination}</b> ${destinations[destination]}`
  }
  if( !message ) message += '<br>type <b class="badge">back</b> to go back'
  return message
}

const listActions = (scene) => {
  let message = ''
  let destinations = {}
  scene.traverse( (n) => {
    if( n.userData && n.userData.href && !n.userData.href.match(/pos=/) ){
      destinations[n.name] = n.userData['aria-description'] || n.userData['aria-label'] || n.userData.href
    } 
  })
  for( let destination in destinations ){
    message += `<br><b class="badge">${destination}</b> ${destinations[destination]}`
  }
  if( !message ) message += '<br>no actions found'
  return message
}

document.addEventListener('chat.input', (e) => {

  if( e.detail.message.trim() == '?' ){
    document.dispatchEvent( new CustomEvent( 'chat.command', {detail:{message:"help"}} ) )
    e.detail.halt = true // don't send to other peers 
  }

  if( e.detail.message.trim() == 'look' ){
    let scene   = xrf.frag.pos.last ? xrf.scene.getObjectByName(xrf.frag.pos.last)  : xrf.scene
    let message = `<div class="transcript">${xrf.sceneToTranscript(scene)}</div><br>possible destinations in this area:${listExits(scene)}`
    e.detail.halt = true // dont print command to screen
    $chat.send({message})
  }

  if( e.detail.message.match(/^go($| )/) ){
    if( e.detail.message.trim() == 'go' ){
      $chat.send({message: `all possible destinations:${listExits(xrf.scene)}`})
    }else{
      let destination = e.detail.message.replace(/^go /,'').trim()
      if( destination.match(/(left|right|forward|backward)/) ){
        let key = ''
        switch( destination){
          case "left":     key = 'ArrowLeft';    break;
          case "right":    key = 'ArrowRight';   break;
          case "forward":  key = 'ArrowUp';      break;
          case "backward": key = 'ArrowDown';    break;
        }
        if( key ){
          let lookcontrols = document.querySelector('[look-controls]')
          if( lookcontrols ) lookcontrols.removeAttribute('look-controls') // workaround to unlock camera

          var wasd = document.querySelector('[wasd-controls]').components['wasd-controls']
          wasd.keys[ key ] = true
          wasd.velocity = new THREE.Vector3()
          setTimeout( () => delete wasd.keys[ key ], 100 )
          wasd.el.object3D.matrixAutoUpdate = true;
          wasd.el.object3D.updateMatrix()
          xrf.camera.getCam().updateMatrix() 
        }
        
      }else{
        let node
        xrf.scene.traverse( (n) => {
          if( n.userData && n.userData.href && n.name == destination ) node = n
        })
        if( node ) xrf.navigator.to( node.userData.href )
        else $chat.send({message:"type 'look' for possible destinations"})
      }
    }
    e.detail.halt = true // dont write input to chat
  }

  if( e.detail.message.match(/^do($| )/) ){
    if( e.detail.message.trim() == 'do' ){
      $chat.send({message: `all possible actions:${listActions(xrf.scene)}`})
    }else{
      let action = e.detail.message.replace(/^do /,'').trim()
      xrf.scene.traverse( (n) => {
        if( n.userData && n.userData.href && n.name == action ){
          $chat.send({message:'<b class="badge">activating</b> '+n.name, class:['self','info']})
          xrf.navigator.to( n.userData.href )
        }
      })
    }
    e.detail.halt = true // dont write input to chat
  }

  if( e.detail.message.match(/^rotate /) ){
    let dir = e.detail.message.replace(/^rotate /,'').trim()
    let y = 0;
    let x = 0;
    switch(dir){
      case "left":  y =  0.3; break;
      case "right": y = -0.3; break;
      case "up":    x =  0.3; break;
      case "down":  x = -0.3; break;
    }
    let lookcontrols = document.querySelector('[look-controls]')
    if( lookcontrols ) lookcontrols.removeAttribute('look-controls') // workaround to unlock camera
    xrf.camera.rotation.y += y
    xrf.camera.rotation.x += x
    xrf.camera.matrixAutoUpdate = true
    e.detail.halt = true // dont write input to chat
  }

  if( e.detail.message.trim() == 'back' ){
    window.history.back()
  }

  if( e.detail.message.trim() == 'forward' ){
    window.history.forward()
  }

})
