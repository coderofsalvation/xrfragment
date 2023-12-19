AFRAME.registerComponent('xrf-menu', {
  schema:{
    id:{ required:true, type:'string'}
  },
  init: function(){
    // add css+html
    window.XRFMENU.init()

    $('a-scene').addEventListener('XRF', this.onXRFready )
    
    if( document.location.search.length > 2 ){
      $('[xrf]').setAttribute('xrf', document.location.search.substr(1)+document.location.hash )
    }

  },

  onXRFready: function(){

    let XRF = window.AFRAME.XRF
    return
    XRFMENU.setupMenu( XRF )

    // on localhost enable debugging mode for developer convenience
    let loc = document.location
    if( loc.host.match(/^localhost/) ){
      $('a-scene').setAttribute('stats')
      XRF.debug = 1
    }

    // add screenshot component with camera to capture bigger size equirects
    // document.querySelector('a-scene').components.screenshot.capture('perspective')
    $('a-scene').setAttribute("screenshot",{camera: "[camera]",width: 4096*2, height:2048*2})

    if( window.outerWidth > 800 )
      setTimeout( () => window.notify("use WASD-keys and mouse-drag to move around",{timeout:false}),2000 )

    window.AFRAME.XRF.addEventListener('href', (data) => data.selected ? window.notify(`href: ${data.xrf.string}`) : false )

    // enable user-uploaded asset files
    let fileLoaders = XRFMENU.loadFile({
      ".gltf": (file) => file.arrayBuffer().then( (data) => xrf.navigator.to(file.name,null, (new xrf.loaders.gltf()), data) ),
      ".glb":  (file) => file.arrayBuffer().then( (data) => xrf.navigator.to(file.name,null, (new xrf.loaders.gltf()), data) )
    })
    $("#overlay > input[type=submit]").addEventListener("click", fileLoaders )

  }


});
