// a portable snackbar

window.SnackBar = function(userOptions) {
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
    if( userOptions ) snackbar.Open();
}

document.head.innerHTML += `
  <style type="text/css">

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
        transition:1s;
        overflow: hidden;
        height: auto;
        margin: 5px 0;
        transition: all ease .5s;
        border-radius: 15px;
        box-shadow: 0 0 4px 0 var(--xrf-box-shadow);
        right: 20px;
        position: fixed;
        top: 18px;
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
        align-items: top;
        padding: 8px 13px 0px 0px;
        user-select: none;
    }

    .js-snackbar__close:hover {
        background-color: #4443;
    }
  </style>
`
