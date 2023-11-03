
// contentLoaders = {".gltf" : () => .....} and so on

export function loadFile(contentLoaders, multiple){
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
}

export function setupConsole(el){
  if( !el ) return setTimeout( () => setupConsole( $('.lil-gui') ),200 )
  let $console = document.createElement('textarea')
  $console.style.position = 'absolute'
  $console.style.display = 'block'
  $console.style.zIndex   = 2000;
  $console.style.background = "transparent !important"
  $console.style.pointerEvents = 'none'
  $console.style.top = '70px'
  $console.style.padding = '10px'
  $console.style.margin = '10px'
  $console.style.background = '#000'
  $console.style.left = $console.style.right = $console.style.bottom = 0;
  $console.style.color = '#A6F';
  $console.style.fontSize = '10px';
  $console.style.fontFamily = 'Courier'
  $console.style.border = '0'
  $console.innerHTML = "XRFRAGMENT CONSOLE OUTPUT:\n" 

  el.appendChild($console)

  console.log = ( (log) => function(){
    let str = ([...arguments]).join(" ")
    let s = str;
    log(s)
    let lines = String($console.innerHTML + "\n"+s).split("\n")
    while( lines.length > 200 ) lines.shift()
    $console.innerHTML = lines.join("\n")
    $console.scrollTop = $console.scrollHeight;
  })(console.log.bind(console))
}

export function setupUrlBar(el,XRF){
  let inIframe = window.location !== window.parent.location
  let ids = ['#overlay','a#embed','a#source','a#model','#qrcode']
  let showButtons = () => {
    ids.map( (i) => $(i).style.display = 'block' ) 
    $('a#more').style.display = 'none' 
    if( inIframe ) $('#uri').style.display = 'block'
  }
  $('a#more').addEventListener('click', () => showButtons() )

  XRF.addEventListener('hash', () => reflectUrl() )
  const reflectUrl = window.reflectUrl = (url) => {
    el.value = url || document.location.search.substr(1) + document.location.hash
    let QR = window.QR
    QR.canvas = document.getElementById('qrcode')
    QR.draw( document.location.href, QR.canvas )
  }
  reflectUrl()
}

function SnackBar(userOptions) {
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
        _Element.classList.add("js-snackbar__wrapper");

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
}

export function notify(scope){
  return function notify(str,opts){
    str  = String(str)
    opts = opts || {}        
    if( !opts.status ){      
      opts.status = "info"   
      if( str.match(/error/g)   ) opts.status = "danger"
      if( str.match(/warning/g) ) opts.status = "warning"
    }
    opts = Object.assign({ message: str , status, timeout:2000 },opts)
    SnackBar( opts )
  }
}

export function download(){
  function fetchAndDownload(dataurl, filename) {
    var a = document.createElement("a");
    a.href = dataurl;
    a.setAttribute("download", filename);
    a.click();
    return false;
  }
  let file = document.location.search.replace(/\?/,'')
  fetchAndDownload( file, file )
}

export function embed(){
  // *TODO* this should be part of the XRF framework
  let camera = document.querySelector('[camera]').object3D.parent // *TODO* fix for threejs
  let lastPos = `pos=${camera.position.x.toFixed(2)},${camera.position.y.toFixed(2)},${camera.position.z.toFixed(2)}`
  let newHash = document.location.hash.replace(/[&]?pos=[0-9\.-]+,[0-9\.-]+,[0-9\.-]+/,'')
  newHash += `&${lastPos}`
  document.location.hash = newHash.replace(/&&/,'&')
  // copy url to clipboard 
  var dummy = document.createElement('input'),
      text = window.location.href;
  document.body.appendChild(dummy);
  dummy.value = text;
  dummy.select();
  document.execCommand('copy');
  document.body.removeChild(dummy); 
  // End of *TODO* 
  window.notify(`<b>Link copied to clipboard!</b> ❤️<br>ps. to embed this experience in your website,<br>copy/paste the following into your HTML:<br><input type="text" value="&lt;iframe src='${document.location.href}'&gt;<br>&lt;/iframe&gt;" id="share"/>`,{timeout:10000})
}
