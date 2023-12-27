// reactive component for displaying the menu 
menuComponent = {

  html: `
    <div id="overlay" class="xrf">
      <div class="logo" ></div>
      <button id="navback"  onclick="history.back()">&lt;</button>
      <button id="navforward" onclick="history.forward()">&gt;</button>
      <input id="load" type="submit" value="load 3D file"></input>
      <input type="text" id="uri" value="" onchange="AFRAME.XRF.navigator.to( $('#uri').value )" style="display:none"/> 
    </div>
    <div class="xrf footer">
      <div class="menu">
        <div id="buttons"></div>
        <a class="btn" id="more" aria-description="menu with options, like extra accessibility" onclick="$menu.toggle()"></a><br>
      </div>
    </div>
  `,

  init: (el) => new Proxy({
    morelabel:  '⚡',
    collapsed:    false,
    logo:       './../../assets/logo.png',
    buttons:    [`<a class="btn" aria-label="button" aria-description="share URL/screenshot/embed"  id="share"   onclick="$menu.share()">🔗 share</a><br>`],

    $overlay: $overlay = el.querySelector('#overlay'),
    $logo:    $logo    = el.querySelector('.logo'),
    $uri:     $uri     = el.querySelector('#uri'),
    $buttons: $buttons = el.querySelector('#buttons'),
    $btnMore: $btnMore = el.querySelector('#more'),

    toggle:   () => $menu.collapsed = !$menu.collapsed,
    install:  (xrf) => {
      this.xrf = xrf
      $menu.bindToWindow() // bind functions like notify to window 
      window.notify('loading '+document.location.search.substr(1))
      document.body.appendChild(el)
      document.dispatchEvent( new CustomEvent("$menu:ready", {detail: xrf}) )

      // add screenshot component with camera to capture bigger size equirects
      // document.querySelector('a-scene').components.screenshot.capture('perspective')
      $('a-scene').setAttribute("screenshot",{camera: "[camera]",width: 4096*2, height:2048*2})
  
      if( window.outerWidth > 800 )
        setTimeout( () => window.notify("use WASD-keys and mouse-drag to move around",{timeout:false}),2000 )
  
      xrf.addEventListener('href', (data) => data.selected ? window.notify(`href: ${data.xrf.string}`) : false )
  
      // enable user-uploaded asset files
      let fileLoaders = $menu.loadFile({
        ".gltf": (file) => file.arrayBuffer().then( (data) => xrf.navigator.to(file.name,null, (new xrf.loaders.gltf()), data) ),
        ".glb":  (file) => file.arrayBuffer().then( (data) => xrf.navigator.to(file.name,null, (new xrf.loaders.gltf()), data) )
      })
      el.querySelector("#overlay > input[type=submit]").addEventListener("click", fileLoaders )
    }

  },{

    get(data,k,v){ return data[k] },
    set(data,k,v){ 
      data[k] = v    
      switch( k ){
        case "logo":       $logo.style.backgroundImage = `url(${v})`;     break;
        case "css":        document.head.innerHTML += v;                  break;
        case "morelabel":  $btnMore.innerText = data.morelabel;           break;
        case "buttons":    $buttons.innerHTML = this.renderButtons(data); 
                           document.dispatchEvent( new CustomEvent("$menu:buttons:render", {detail: el.querySelector('.menu') }) )
                           break;
        case "collapsed":  $overlay.style.display = data.collapsed ? 'block' : 'none'
                           $buttons.style.display = data.collapsed ? 'block' : 'none'
                           break;
      }
    },

    renderButtons: (data) => `${data.buttons.join('')}`

  })
}

// reactify component!
$menu = document.createElement('div')
$menu.innerHTML = menuComponent.html
$menu = menuComponent.init($menu)

// attach menu functions which are less related to rendering 
let utils = {



  bindToWindow(opts){

    window.notify   = $menu.notify(window)

    // reroute console messages to snackbar notifications
    console.log = ( (log,console) => function(str){
      if( String(str).match(/(:.*#|note:|:\/\/)/) ) window.notify( str )
      log.call(console,str)
    })(console.log, console)

    // allow iframe to open url
    window.addEventListener('message', (event) => {
      if (event.data && event.data.url) {
        window.open(event.data.url, '_blank');
      }
    });
  },
      
  loadFile(contentLoaders, multiple){
    return () => {
      window.notify("if you're on Meta browser, file-uploads might be disabled")
      let input = document.createElement('input');
      input.type = 'file';
      input.multiple = multiple;
      input.accept = Object.keys(contentLoaders).join(",");
      input.onchange = () => {
          let files = Array.from(input.files);
          let file = files.slice ? files[0] : files 
          for( var i in contentLoaders ){
            let r = new RegExp('\\'+i+'$')
            if( file.name.match(r) ) return contentLoaders[i](file)
          }
          alert(file.name+" is not supported")
      };
      input.click();
    }
  },

  SnackBar(userOptions) {
      var snackbar = this || (window.snackbar = {});
      var _Interval;
      var _Message;
      var _Element;
      var _Container;
      
      var _OptionDefaults = {
          message: "Operation performed successfully.",
          dismissible: true,
          timeout: 7000,
          status: ""
      }
      var _Options = _OptionDefaults;

      function _Create() {
          _Container = document.querySelector(".js-snackbar-container") 
          if( _Container ){
            _Container.remove()
          }
          _Container = null

          if (!_Container) {
              // need to create a new container for notifications
              _Container = document.createElement("div");
              _Container.classList.add("js-snackbar-container");

              document.body.appendChild(_Container);
          }
          _Container.opts = _Options
          _Container.innerHTML = ''
          _Element = document.createElement("div");
          _Element.classList.add("js-snackbar__wrapper","xrf");

          let innerSnack = document.createElement("div");
          innerSnack.classList.add("js-snackbar", "js-snackbar--show");
      
          if (_Options.status) {
              _Options.status = _Options.status.toLowerCase().trim();

              let status = document.createElement("span");
              status.classList.add("js-snackbar__status");


              if (_Options.status === "success" || _Options.status === "green") {
                  status.classList.add("js-snackbar--success");
              }
              else if (_Options.status === "warning" || _Options.status === "alert" || _Options.status === "orange") {
                  status.classList.add("js-snackbar--warning");
              }
              else if (_Options.status === "danger" || _Options.status === "error" || _Options.status === "red") {
                  status.classList.add("js-snackbar--danger");
              }
              else {
                  status.classList.add("js-snackbar--info");
              }

              innerSnack.appendChild(status);
          }
          
          _Message = document.createElement("span");
          _Message.classList.add("js-snackbar__message");
          if( typeof _Options.message == 'string' ){
            _Message.innerHTML = _Options.message;
          }else _Message.appendChild(_Options.message)

          innerSnack.appendChild(_Message);

          if (_Options.dismissible) {
              let closeBtn = document.createElement("span");
              closeBtn.classList.add("js-snackbar__close");
              closeBtn.innerText = "\u00D7";

              closeBtn.onclick = snackbar.Close;

              innerSnack.appendChild(closeBtn);
          }

          _Element.style.height = "0px";
          _Element.style.opacity = "0";
          _Element.style.marginTop = "0px";
          _Element.style.marginBottom = "0px";

          _Element.appendChild(innerSnack);
          _Container.appendChild(_Element);

          if (_Options.timeout !== false) {
              _Interval = setTimeout(snackbar.Close, _Options.timeout);
          }
      }

      snackbar.Open = function() {
          let contentHeight = _Element.firstElementChild.scrollHeight; // get the height of the content

          _Element.style.height = contentHeight + "px";
          _Element.style.opacity = 1;
          _Element.style.marginTop = "5px";
          _Element.style.marginBottom = "5px";

          _Element.addEventListener("transitioned", function() {
              _Element.removeEventListener("transitioned", arguments.callee);
              _Element.style.height = null;
          })
      }

      snackbar.Close = function () {
          if (_Interval)
              clearInterval(_Interval);

          let snackbarHeight = _Element.scrollHeight; // get the auto height as a px value
          let snackbarTransitions = _Element.style.transition;
          _Element.style.transition = "";

          requestAnimationFrame(function() {
              _Element.style.height = snackbarHeight + "px"; // set the auto height to the px height
              _Element.style.opacity = 1;
              _Element.style.marginTop = "0px";
              _Element.style.marginBottom = "0px";
              _Element.style.transition = snackbarTransitions

              requestAnimationFrame(function() {
                  _Element.style.height = "0px";
                  _Element.style.opacity = 0;
              })
          });

          setTimeout(function() {
              try { 
                _Container.removeChild(_Element); 
              } catch (e) { }
          }, 1000);
      };

      _Options = { ..._OptionDefaults, ...userOptions }
      _Create();
      snackbar.Open();
  },

  notify(scope){
    return function notify(_str,opts){
      str = _str.replace(/(^\w+):/,"<div class='badge'>\$1</div>") 
      opts = opts || {status:'info'}        
      opts = Object.assign({ status, timeout:4000 },opts)
      if( typeof str == 'string' ){
        if( !opts.status ){      
          if( str.match(/error/g)   ) opts.status = "danger"
          if( str.match(/warning/g) ) opts.status = "warning"
        }
      }
      opts.message = str
      window.$menu.SnackBar( opts )
      opts.message = _str
      document.dispatchEvent( new CustomEvent("notify", {detail:opts}) )
    }
  },

  download(){
    function fetchAndDownload(dataurl, filename) {
      var a = document.createElement("a");
      a.href = dataurl;
      a.setAttribute("download", filename);
      a.click();
      return false;
    }
    let file = document.location.search.replace(/\?/,'')
    fetchAndDownload( file, file )
  },

  updateHashPosition(randomize){
    // *TODO* this should be part of the XRF Threejs framework
    if( typeof THREE == 'undefined' ) THREE = xrf.THREE 
    let radToDeg  = THREE.MathUtils.radToDeg
    let toDeg     = (x) => x / (Math.PI / 180)
    let camera    = document.querySelector('[camera]').object3D.parent // *TODO* fix for threejs
    camera.position.x += Math.random()/10
    camera.position.z += Math.random()/10

    // *TODO* add camera direction
    let direction = new xrf.THREE.Vector3()
    camera.getWorldDirection(direction)
    const pitch   = Math.asin(direction.y);
    const yaw     = Math.atan2(direction.x, direction.z);
    const pitchInDegrees = pitch * 180 / Math.PI;
    const yawInDegrees = yaw * 180 / Math.PI;

    let lastPos = `pos=${camera.position.x.toFixed(2)},${camera.position.y.toFixed(2)},${camera.position.z.toFixed(2)}`
    let newHash = document.location.hash.replace(/[&]?(pos|rot)=[0-9\.-]+,[0-9\.-]+,[0-9\.-]+/,'')
    newHash += `&${lastPos}`
    document.location.hash = newHash.replace(/&&/,'&')
                                    .replace(/#&/,'')
    $menu.copyToClipboard( window.location.href );
  },

  copyToClipboard(text){
    // copy url to clipboard 
    var dummy = document.createElement('input')
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy); 
  },

  share(){
    let inMeeting = $('[meeting]')
    let url = window.location.href
    if( !inMeeting ) $menu.updateHashPosition()
    else url = $('[meeting]').components['meeting'].data.link
    $menu.copyToClipboard( url )
    // End of *TODO* 
    window.notify(`<h2>${ inMeeting ? 'Meeting link ' : 'Link'} copied to clipboard!</h2> <br>Now share it with your friends ❤️<br>
      <canvas id="qrcode" width="121" height="121"></canvas><br>
      <button onclick="$menu.download()">💾 download scene file</button> <br>
      <button onclick="alert('this might take a while'); $('a-scene').components.screenshot.capture('equirectangular')">📷 download 360 screenshot</button> <br>
      <a class="btn" target="_blank" href="https://github.com/coderofsalvation/xrfragment-helloworld">🖥 clone & selfhost this experience</a><br>
      <br>
      To embed this experience in your blog,<br>
      copy/paste the following into your HTML:<br><input type="text" value="&lt;iframe src='${document.location.href}'&gt;<br>&lt;/iframe&gt;" id="share"/>
      <br>
    `,{timeout:2000000})
    // draw QR code
    setTimeout( () => {
      let QR  = window.QR
      QR.canvas = document.getElementById('qrcode')
      QR.draw( url, QR.canvas )
    },0)
  }
}

// map to component
for( let i in utils ) $menu[i] = utils[i]

//$('a-scene').addEventListener('XRF', this.onXRFready )
//    
//    if( document.location.search.length > 2 ){
//      $('[xrf]').setAttribute('xrf', document.location.search.substr(1)+document.location.hash )
//    }
//
//  },
//
//  onXRFready: function(){
//
//    let XRF = window.AFRAME.XRF
//    //setupMenu(XRF){
//    //  let aScene   = document.querySelector('a-scene')
//    //  let urlbar   = $('input#uri')
//    //  let inIframe = window.location !== window.parent.location
//    //  let els      = [ ...document.querySelectorAll('.menu .btn') ]
//    //  els          = els.filter( (el) => el.id != "more" ? el : false )
//
//    //  // enable meetings
//    //  let startMeeting = () => {
//    //    aScene.setAttribute('meeting', 'id: xrfragments') 
//    //    $('a#meeting').innerText = '🧑‍🤝‍🧑 breakout meeting'
//    //    $('a#meeting').setAttribute('aria-description','breakout room')
//    //  }
//    //  $('a#meeting').addEventListener('click', () => {
//    //    if( aScene.getAttribute('meeting') ){ // meeting already, start breakout room
//    //      let parentRoom = document.location.href
//    //      $menu.updateHashPosition(true) 
//    //      let meeting = $('[meeting]').components['meeting']
//    //      meeting.data.parentRoom = parentRoom
//    //      meeting.update()
//    //    }else startMeeting()
//    //  })
//    //  if( document.location.hash.match(/(#|&)meet/) ) startMeeting()
//
//    //  XRF.addEventListener('hash', () => reflectUrl() )
//    //  const reflectUrl = window.reflectUrl = (url) => {
//    //    urlbar.value = url || document.location.search.substr(1) + document.location.hash
//    //  }
//    //  reflectUrl()
//    //},
//
//
//    // on localhost enable debugging mode for developer convenience
//    let loc = document.location
//    if( loc.host.match(/^localhost/) ){
//      $('a-scene').setAttribute('stats')
//      XRF.debug = 1
//    }
//
//    // add screenshot component with camera to capture bigger size equirects
//    // document.querySelector('a-scene').components.screenshot.capture('perspective')
//    $('a-scene').setAttribute("screenshot",{camera: "[camera]",width: 4096*2, height:2048*2})
//
//    if( window.outerWidth > 800 )
//      setTimeout( () => window.notify("use WASD-keys and mouse-drag to move around",{timeout:false}),2000 )
//
//    window.AFRAME.XRF.addEventListener('href', (data) => data.selected ? window.notify(`href: ${data.xrf.string}`) : false )
//
//    // enable user-uploaded asset files
//    let fileLoaders = $menu.loadFile({
//      ".gltf": (file) => file.arrayBuffer().then( (data) => xrf.navigator.to(file.name,null, (new xrf.loaders.gltf()), data) ),
//      ".glb":  (file) => file.arrayBuffer().then( (data) => xrf.navigator.to(file.name,null, (new xrf.loaders.gltf()), data) )
//    })
//    $("#overlay > input[type=submit]").addEventListener("click", fileLoaders )


// finally add some css 
$menu.css = `
  <style type="text/css">
    :root {
        --xrf-primary: #6839dc;
        --xrf-primary-fg: #FFF;
        --xrf-light-primary: #ea23cf;
        --xrf-secondary: #872eff;
        --xrf-light-xrf-secondary: #ce7df2;
        --xrf-overlay-bg: #fffb;
        --xrf-box-shadow: #0005;
        --xrf-red: red;
        --xrf-dark-gray: #343334;
        --xrf-gray: #424280;
        --xrf-white: #fdfdfd;
        --xrf-light-gray: #efefef;
        --xrf-lighter-gray: #e4e2fb96;
        --xrf-font-sans-serif: system-ui, -apple-system, segoe ui, roboto, ubuntu, helvetica, cantarell, noto sans, sans-serif;
        --xrf-font-monospace: menlo, monaco, lucida console, liberation mono, dejavu sans mono, bitstream vera sans mono, courier new, monospace, serif;
        --xrf-font-size-0: 12px;
        --xrf-font-size-1: 14px;
        --xrf-font-size-2: 17px;
        --xrf-font-size-3: 21px;
    }

    /* CSS reset */
    html{line-height:1.15;-webkit-text-size-adjust:100%}body{margin:0}main{display:block}h1{font-size:2em;margin:0.67em 0}hr{box-sizing:content-box;height:0;overflow:visible}pre{font-family:monospace, monospace;font-size:1em}a{background-color:transparent}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}b,strong{font-weight:bolder}code,kbd,samp{font-family:monospace, monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-0.25em}sup{top:-0.5em}img{border-style:none}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0}button,input{overflow:visible}button,select{text-transform:none}[type="button"],[type="reset"],[type="submit"],button{-webkit-appearance:button}[type="button"]::-moz-focus-inner,[type="reset"]::-moz-focus-inner,[type="submit"]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type="button"]:-moz-focusring,[type="reset"]:-moz-focusring,[type="submit"]:-moz-focusring,button:-moz-focusring{outline:1px dotted ButtonText}fieldset{padding:0.35em 0.75em 0.625em}legend{box-sizing:border-box;color:inherit;display:table;max-width:100%;padding:0;white-space:normal}progress{vertical-align:baseline}textarea{overflow:auto}[type="checkbox"],[type="radio"]{box-sizing:border-box;padding:0}[type="number"]::-webkit-inner-spin-button,[type="number"]::-webkit-outer-spin-button{height:auto}[type="search"]{-webkit-appearance:textfield;outline-offset:-2px}[type="search"]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}details{display:block}summary{display:list-item}template{display:none}[hidden]{display:none}

    .xrf table tr td{
      vertical-align:top;
    }
    .xrf button,
    .xrf input[type="submit"],
    .xrf .btn {
      text-decoration:none;
      background: var(--xrf-primary);
      border: 0;
      border-radius: 25px;
      padding: 11px 15px;
      font-weight: bold;  
      transition: 0.3s;
      height: 32px;
      font-size: var(--xrf-font-size-1);
      color: var(--xrf-primary-fg);
      line-height: var(--xrf-font-size-1);
      cursor:pointer;
      white-space:pre;
      min-width: 45px;
      box-shadow: 0px 0px 10px var(--xrf-box-shadow);
    }

    .xrf button:hover,
    .xrf input[type="submit"]:hover,
    .xrf .btn:hover {
      background: var(--xrf-secondary);
      text-decoration:none;
    }

    .xrf, .xrf *{
      font-family: var(--xrf-font-sans-serif);
      font-size: var(--xrf-font-size-1);
      line-height:27px;
    }

    textarea, select, input[type="text"] {
      background: transparent; /* linear-gradient( var(--xrf-lighter-gray), var(--xrf-gray) ) !important; */
    }

    input[type="submit"] {
      color: var(--xrf-light-gray);
    }

    input[type=text]{
      padding:7px 15px;
    }
    input{
      border-radius:7px;
      margin:5px 0px;
    }

    .title {
      border-bottom: 2px solid var(--xrf-secondary);
      padding-bottom: 20px;
    }

    #overlay{
      background: var(--xrf-overlay-bg);
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 48px;
      box-shadow: 0px 0px 10px var(--xrf-box-shadow);
      opacity: 0.9;
      z-index:2000;
    }

    #overlay .logo{
      width: 92px;
      position: absolute;
      top: 9px;
      left: 93px;
      height: 30px;
      background-size: contain;
      background-repeat: no-repeat;
    }

    #overlay > input[type="submit"] {
      height: 32px;
      position: absolute;
      right: 20px;
      top: 2px;
    }

    #overlay > button#navback,
    #overlay > button#navforward {
      height: 32px;
      font-size: var(--xrf-font-size-1);
      position: absolute;
      left: 9px;
      padding: 2px 13px;
      border-radius:6px;
      top: 8px;
      color: var(--xrf-light-gray);
      width: 36px;
      min-width: unset;
    }
    #overlay > button#navforward {
      left:49px;
    }

    #overlay > #uri {
        height: 18px;
        font-size: var(--xrf-font-size-3);
        position: absolute;
        left: 200px;
        top: 9px;
        max-width: 550px;
        padding: 5px 0px 5px 5px;
        width: calc( 63% - 200px);
        background: #f0f0f0;
        border-color: #Ccc;
        border: 2px solid #CCC;
        border-radius: 7px;
        color: #555;
    }



    .menu .btn{
      display:inline-block;
      background: var(--xrf-primary);
      border-radius: 25px;
      border: 0;
      padding: 5px 19px;
      font-weight: 1000;
      font-family: sans-serif;
      font-size: var(--xrf-font-size-2);
      color:var(--xrf-primary-fg);
      height:33px;
      z-index:2000;
      cursor:pointer;
      min-width:130px;
      text-decoration:none;
      margin-top: 15px;
      line-height:36px;
      margin-right:10px;
      text-align:left;
    }

    .xrf a.btn#more{
      z-index:3000;
      width: 19px;
      min-width: 19px;
      font-size:16px;
      text-align: center;
      background:white;
      color: var(--xrf-primary);
    }

    html{
      max-width:unset;
    }

    .render {
      position:absolute;
      top:0;
      left:0;
      right:0;
      bottom:0;
    }

    .lil-gui.autoPlace{
      right:0px !important;
      top:48px !important;
      height:33vh;
    }

    #VRButton {
      margin-bottom:20vh;
    }

    @media (max-width: 450px) {
      #uri{ display:none; }
    }

    @media (max-width: 640px) {
      .lil-gui.root{
        top:auto !important;
        left:auto !important;
      }
      .js-snackbar__message{
        overflow-y:auto;
        max-height:600px;
      }
      .js-snackbar__message h1,h2,h3{
        font-size:22px;
      }
      .xrf table tr td {
    
      }
      :root{
        --xrf-font-size-1: 13px;
        --xrf-font-size-2: 17px;
        --xrf-font-size-3: 20px;
      }
    }


    /* notifications */

    .js-snackbar-container .btn,
    .js-snackbar-container input[type=submit],
    .js-snackbar-container button{
      margin-bottom:15px;
    }
    .js-snackbar-container {
        position: absolute;
        top: 10px;
        left: 0px;
        display: flex;
        align-items: center;
      width:100%;
        max-width: 100%;
        padding: 10px;
        z-index:1001;
      justify-content: center;
        overflow: hidden;
    }

    .js-snackbar-container * {
        box-sizing: border-box;
    }

    .js-snackbar__wrapper {
      --color-c: #555;
      --color-a: #FFF;
    }


    .js-snackbar__wrapper {
        overflow: hidden;
        height: auto;
        margin: 5px 0;
        transition: all ease .5s;
        border-radius: 3px;
        box-shadow: 0 0 4px 0 var(--xrf-box-shadow);
        right: 20px;
        position: fixed;
        top: 55px;
    }

    .js-snackbar {
        display: inline-flex;
        box-sizing: border-box;
        border-radius: 3px;
        color: var(--color-c);
        background-color: var(--color-a);
        vertical-align: bottom;
    }

    .js-snackbar__close,
    .js-snackbar__status,
    .js-snackbar__message {
        position: relative;
    }

    .js-snackbar__message {
      margin: 12px;
    }

    .js-snackbar__status {
        display: none;
        width: 15px;
        margin-right: 5px;
        border-radius: 3px 0 0 3px;
        background-color: transparent;
    }

     .js-snackbar__status.js-snackbar--success,
     .js-snackbar__status.js-snackbar--warning,
     .js-snackbar__status.js-snackbar--danger,
     .js-snackbar__status.js-snackbar--info {
        display: block;
    }

    .js-snackbar__status.js-snackbar--success  {
        background-color: #4caf50;
    }

    .js-snackbar__status.js-snackbar--warning  {
        background-color: #ff9800;
    }

     .js-snackbar__status.js-snackbar--danger {
        background-color: #ff6060;
    }

    .js-snackbar__status.js-snackbar--info {
        background-color: #CCC;
    }

    .js-snackbar__close {
        cursor: pointer;
        display: flex;
        align-items: center;
        padding: 0 10px;
        user-select: none;
    }

    .js-snackbar__close:hover {
        background-color: #4443;
    }

    .a-enter-vr-button, .a-enter-ar-button{
      height:41px;
    }

    #qrcode{
      background: transparent;
      overflow: hidden;
      height: 121px;
      display: inline-block;
      position: relative;
    }

    input#share{
      font-size: var(--xrf-font-size-1);
      font-family: var(--xrf-font-monospace);
      border:2px solid #AAA;
      width:50vw;
      max-width:400px;
    }

    .footer {
      display: flex;
      flex-direction: column-reverse; /* This reverses the stacking order of the flex container */
      align-items: flex-end;
      height: 100%;
      position: fixed;
      top: 71px;
      right: 11px;
      bottom: 0;
      padding-bottom:149px;
      box-sizing:border-box;
    }
    .footer .menu{
      text-align:right;
    }

    .badge {
      display:inline-block;
      color: var(--xrf-white);
      font-weight: bold;
      background: var(--xrf-gray);
      border-radius:5px;
      padding:0px 4px;
      font-size: var(--xrf-font-size-0);
      margin-right:10px
    }
    a.badge {
      text-decoration:none;
    }

    .xrf select{
      min-width: 200px;oborder-inline: none;
      border-inline: none;
      border-block: none;
      border: 1px solid #AAA;
      box-shadow: 0px 0px 5px #0003;
      height: 31px;
      border-radius: 5px;
      background: var(--xrf-lighter-gray);
    }

    .xrf table tr td {
       vertical-align:middle;
    }
    .xrf table tr td:nth-child(1){
      padding-right:35px;
      min-width:80px;
    }


  </style>
`
