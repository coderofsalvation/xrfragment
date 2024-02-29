AFRAME.registerComponent('vconsole', {
  init: function () {  
      //AFRAME.XRF.navigator.to("https://coderofsalvation.github.io/xrsh-media/assets/background.glb")
    return

    document.head.innerHTML += `
      <style type="text/css">
        .vc-panel  {
          right:unset !important;
          width:100%;
          max-width:900px;
          z-index:100 !important;
        }
        .vc-mask{ display:none !important; }
      </style>
    `
    let script = document.createElement("script")
    script.src = "https://unpkg.com/vconsole@latest/dist/vconsole.min.js"
    script.setAttribute('async','true')
    script.onload = function(){
      this.vConsole = new window.VConsole() 
      document.querySelector('.vc-switch').style.right = 'unset'
      document.querySelector('.vc-switch').style.left  = '20px'
    }
    document.body.appendChild(script)
  }

});

