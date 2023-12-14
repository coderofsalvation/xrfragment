// handy shortcuts
if( !window.$  ) window.$  = (s) => s ? document.querySelector(s)           : false
if( !window.$$ ) window.$$ = (s) => s ? [ ...document.querySelectorAll(s) ] : false

window.XRFMENU = {

  logo: './../../assets/logo.png',

  html: [ 
     `<a class="btn" aria-label="button" aria-description="start text/audio/video chat" id="meeting" target="_blank">🧑‍🤝‍🧑 meeting</a><br>`,
     `<a class="btn" aria-label="button" aria-description="share URL/screenshot/embed" id="share" target="_blank" onclick="window.embed()">🔗 share</a><br>`
  ],

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

  setupMenu(XRF){
    let urlbar   = $('input#uri')
    let inIframe = window.location !== window.parent.location
    let els      = [ ...document.querySelectorAll('.footer .btn') ]
    els          = els.filter( (el) => el.id != "more" ? el : false )

    let showMenu = (state) => {
      els.map( (el) => el.style.display = state ? 'inline-block' : 'none' )
      $('a#more').style.display         = state ? 'none'         : 'inline-block'
      $('#overlay').style.display       = state ? 'inline-block' : 'none'
      if( inIframe ) $('#uri').style.display = 'block'
    }

    els.map( (el) => el.addEventListener('click', () => showMenu(false) ) )
    $('a#more').addEventListener('click',    () => showMenu(true) )
    $('.a-canvas').addEventListener('click',    () => showMenu(false) )
    $('a#meeting').addEventListener('click', () => document.querySelector('a-scene').setAttribute('meeting', 'id: xrfragments') )

    XRF.addEventListener('hash', () => reflectUrl() )
    const reflectUrl = window.reflectUrl = (url) => {
      urlbar.value = url || document.location.search.substr(1) + document.location.hash
    }
    reflectUrl()
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
          let _Containers = [ ...document.querySelectorAll(".js-snackbar-container") ]
          _Containers.map( (c) => c.remove() )
          _Container = null

          if (!_Container) {
              // need to create a new container for notifications
              _Container = document.createElement("div");
              _Container.classList.add("js-snackbar-container");

              document.body.appendChild(_Container);
          }
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
          _Message.innerHTML = _Options.message;

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

      var _ConfigureDefaults = function() {
          // if no options given, revert to default
          if (userOptions === undefined) {
              return;
          }

          if (userOptions.message !== undefined) {
              _Options.message = userOptions.message;
          }

          if (userOptions.dismissible !== undefined) {
              if (typeof (userOptions.dismissible) === "string") {
                  _Options.dismissible = (userOptions.dismissible === "true");
              }
              else if (typeof (userOptions.dismissible) === "boolean") {
                  _Options.dismissible = userOptions.dismissible;
              }
              else {
                  console.debug("Invalid option provided for 'dismissable' [" + userOptions.dismissible + "] is of type " + (typeof userOptions.dismissible));
              }
          }


          if (userOptions.timeout !== undefined) {
              if (typeof (userOptions.timeout) === "boolean" && userOptions.timeout === false) {
                  _Options.timeout = false;
              }
              else if (typeof (userOptions.timeout) === "string") {
                  _Options.timeout = parseInt(userOptions.timeout);
              }


              if (typeof (userOptions.timeout) === "number") {
                  if (userOptions.timeout === Infinity) {
                      _Options.timeout = false;
                  }
                  else if (userOptions.timeout >= 0) {
                      _Options.timeout = userOptions.timeout;
                  }
                  else {
                      console.debug("Invalid timeout entered. Must be greater than or equal to 0.");
                  }

                  _Options.timeout = userOptions.timeout;
              }

              
          }

          if (userOptions.status !== undefined) {
              _Options.status = userOptions.status;
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
              try { _Container.removeChild(_Element); } catch (e) { }
          }, 1000);
      };

      _ConfigureDefaults();
      _Create();
      snackbar.Open();
  },

  notify(scope){
    return function notify(str,opts){
      str  = String(str)
      opts = opts || {}        
      if( !opts.status ){      
        opts.status = "info"   
        if( str.match(/error/g)   ) opts.status = "danger"
        if( str.match(/warning/g) ) opts.status = "warning"
      }
      opts = Object.assign({ message: str , status, timeout:4000 },opts)
      window.XRFMENU.SnackBar( opts )
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

  embed(){
    // *TODO* this should be part of the XRF Threejs framework
    if( typeof THREE == 'undefined' ) THREE = xrf.THREE 
    let radToDeg  = THREE.MathUtils.radToDeg
    let toDeg     = (x) => x / (Math.PI / 180)
    let camera    = document.querySelector('[camera]').object3D.parent // *TODO* fix for threejs

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
    // copy url to clipboard 
    var dummy = document.createElement('input'),
        text = window.location.href;
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy); 
    // End of *TODO* 
    window.notify(`<b>Link copied to clipboard!</b> ❤️<br><br>
      <canvas id="qrcode" width="121" height="121"></canvas><br>
      <button onclick="window.download()">💾 download scene file</button> <br>
      <button onclick="alert('this might take a while'); $('a-scene').components.screenshot.capture('equirectangular')">📷 download 360 screenshot</button> <br>
      <a class="btn" target="_blank" href="https://github.com/coderofsalvation/xrfragment-helloworld">🖥 clone & selfhost this experience</a><br>
      <br>
      To embed this experience in your blog,<br>
      copy/paste the following into your HTML:<br><input type="text" value="&lt;iframe src='${document.location.href}'&gt;<br>&lt;/iframe&gt;" id="share"/>
      <br>
    `,{timeout:2000000})
    // draw QR code
    setTimeout( () => {
      let QR = window.QR
      QR.canvas = document.getElementById('qrcode')
      QR.draw( document.location.href, QR.canvas )
    },0)
  }
}

window.XRFMENU.addHTML = () => {

  let el = document.createElement("div")
  el.innerHTML += `<style type="text/css">
    :root {
        --xrf-primary: #6839dc;
        --xrf-primary-fg: #FFF;
        --xrf-light-primary: #ea23cf;
        --xrf-secondary: #872eff;
        --xrf-light-xrf-secondary: #ce7df2;
        --xrf-overlay-bg: #fffb;
        --xrf-box-shadow: #0005;
        --xrf-red: red;
        --xrf-black: #424280;
        --xrf-white: #fdfdfd;
        --xrf-dark-gray: #343334;
        --xrf-gray: #ecf7ff47;
        --xrf-light-gray: #efefef;
        --xrf-lighter-gray: #e4e2fb96;
        --xrf-font-sans-serif: system-ui, -apple-system, segoe ui, roboto, ubuntu, helvetica, cantarell, noto sans, sans-serif;
        --xrf-font-monospace: menlo, monaco, lucida console, liberation mono, dejavu sans mono, bitstream vera sans mono, courier new, monospace, serif;
        --xrf-font-size-1: 14px;
        --xrf-font-size-2: 17px;
        --xrf-font-size-3: 21px;
    }

    .xrf table tr td{
      vertical-align:top;
    }
    .xrf table tr td:nth-child(1){
      padding-right:35px;
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
    }

    .xrf button:hover,
    .xrf input[type="submit"]:hover,
    .xrf .btn:hover {
      background: var(--xrf-secondary);
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



    .xrf.footer .btn{
      background: var(--xrf-primary);
      box-shadow: 0px 0px 10px var(--xrf-box-shadow);
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
      min-width:107px;
      text-decoration:none;
      display:none;
      margin-top: 15px;
      line-height:36px;
      margin-right:10px;
    }

    .xrf a.btn#more{
      width: 19px;
      min-width: 19px;
      font-size:16px;
      text-align: center;
      background:white;
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

  </style>
  <div id="overlay" class="xrf" style="display:none">
    <div class="logo"></div>
    <button id="navback"  onclick="history.back()">&lt;</button>
    <button id="navforward" onclick="history.forward()">&gt;</button>
    <input type="submit" value="load 3D file"></input>
    <input type="text" id="uri" value="" onchange="AFRAME.XRF.navigator.to( $('#uri').value )" style="display:none"/> 
  </div>
  <!-- open AFRAME inspector: $('a-scene').components.inspector.openInspector() -->
  <div class="xrf footer">
    <div>
      ${window.XRFMENU.html.map( (html) => typeof html == "function" ? html() : html ).join('\n')}
      <a class="btn" id="more" style="display:inline-block">${window.XRFMENU.morelabel}</a>
    </div>
  </div>
  `
  document.body.appendChild(el)

  if( XRFMENU.logo ) $('.logo').style['background-image'] = `url(${XRFMENU.logo})`

  window.notify   = XRFMENU.notify(window)
  window.embed    = XRFMENU.embed
  window.download = XRFMENU.download
  window.notify('loading '+document.location.search.substr(1))
  // reroute console messages to snackbar notifications
  console.log = ( (log) => function(str){
    if( String(str).match(/(:.*#|note:)/) ) window.notify(str)
    log(str)
  })(console.log)
  // allow iframe to open url
  window.addEventListener('message', (event) => {
    if (event.data && event.data.url) {
      window.open(event.data.url, '_blank');
    }
  });
      
}
