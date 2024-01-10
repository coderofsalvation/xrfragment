document.head.innerHTML += `
  <style type="text/css">
    :root {
        --xrf-primary: #6839dc;
        --xrf-primary-fg: #FFF;
        --xrf-light-primary: #ea23cf;
        --xrf-secondary: #872eff;
        --xrf-light-xrf-secondary: #ce7df2;
        --xrf-topbar-bg: #fffb;
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
      height: 40px;
      font-size: var(--xrf-font-size-1);
      color: var(--xrf-primary-fg);
      line-height: var(--xrf-font-size-1);
      cursor:pointer;
      white-space:pre;
      min-width: 45px;
      box-shadow: 0px 0px 10px var(--xrf-box-shadow);
      display:inline-block;
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

    #topbar{
      background: var(--xrf-topbar-bg);
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 48px;
      box-shadow: 0px 0px 10px var(--xrf-box-shadow);
      opacity: 0.9;
      z-index:2000;
      display:none;
    }

    #topbar .logo{
      width: 92px;
      position: absolute;
      top: 9px;
      left: 93px;
      height: 30px;
      background-size: contain;
      background-repeat: no-repeat;
    }

    #topbar > input[type="submit"] {
      height: 32px;
      position: absolute;
      right: 20px;
      top: 2px;
      min-width:135px;
    }

    #topbar > button#navback,
    #topbar > button#navforward {
      height: 32px;
      font-size: 24px;
      position: absolute;
      left: 9px;
      padding: 2px 13px;
      border-radius:6px;
      top: 8px;
      color: var(--xrf-light-gray);
      width: 36px;
      min-width: unset;
    }
    #topbar > button#navforward {
      left:49px;
    }

    #topbar > #uri {
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



    .footer > .menu .btn{
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
      min-width:145px;
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
    .xrf a.btn#more i.gg-menu{
      margin-top:15px;
    }
    .xrf a.btn#more i.gg-close,
    .xrf a.btn#more i.gg-menu{
      color:#888;
    }
    .xrf a.btn#meeting i.gg-user-add{
      margin-right: 12px;
    }

    .xrf a.btn#share i.gg-link{
      margin-right:24px;
    }

    .xrf a.btn#accessibility i.gg-yinyang{
      margin-right:13px;
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
      z-index:1000;
      display: flex;
      flex-direction: column-reverse; /* This reverses the stacking order of the flex container */
      align-items: flex-end;
      height: 100%;
      position: fixed;
      top: 71px;
      right: 11px;
      bottom: 0;
      padding-bottom:140px;
      box-sizing:border-box;
      pointer-events:none;
    }
    .footer *{
      pointer-events:all;
    }
    .footer .menu{
      text-align:right;
    }

    .badge,
    #messages .msg.ui div.badge{
      display:inline-block;
      color: var(--xrf-white);
      font-weight: bold;
      background: var(--xrf-gray);
      border-radius:5px;
      padding:0px 4px;
      font-size: var(--xrf-font-size-0);
      margin-right:10px;
      text-decoration:none !important;
    }
    .ruler{
      width:97%; 
      margin:7px 0px;
    }


    a.badge {
      text-decoration:none;
    }

    .xrf select{
      border-inline: none;
      border-inline: none;
      border-block: none;
      border: 3px solid var(--xrf-primary);
      border-radius: 5px;
      background: none;
      border-radius:30px;
    }
    .xrf select,
    .xrf option{
      padding: 0px 16px;
      min-width: 150px;
      max-width: 150px;
      height: 35px;
    }

    .xrf input{
      border-radius:30px;
      padding: 7px 15px;
      border-block: none;
      border-inline: none;
      border: 1px solid #888;
      background: transparent;
      max-width:105px;
    }

    .xrf table tr td {
      vertical-align:middle;
      text-align:right;
    }
    .xrf table tr td:nth-child(1){
      min-width:82px;
      height:40px;
      padding-right:15px;
    }

    .xrf small{
      font-size: var(--xrf-font-size-0);
    }
    .disabled{
      opacity:0.5
    }

  body.menu .js-snackbar__wrapper {
    top: 64px; 
  }

  .right { float:right }
  .left  { float:left  }

  /*
   * tabs 
   */ 
  div.tab-frame > input{ display:none;}
  div.tab-frame > label{ display:block; float:left;padding:5px 10px; cursor:pointer;  }
  div.tab-frame > input:checked + label{ cursor:default; border-bottom:1px solid #888; font-weight:bold; }
  div.tab-frame > div.tab{ display:none; padding:15px 10px 5px 10px;clear:left}

  div.tab-frame > input:nth-of-type(1):checked ~ .tab:nth-of-type(1),
  div.tab-frame > input:nth-of-type(2):checked ~ .tab:nth-of-type(2),
  div.tab-frame > input:nth-of-type(3):checked ~ .tab:nth-of-type(3){ display:block;}


  /*
   * css icons from https://css.gg
   */

  .gg-close-o {
      box-sizing: border-box;
      position: relative;
      display: block;
      transform: scale(var(--ggs,1));
      width: 22px;
      height: 22px;
      border: 2px solid;
      border-radius: 40px
  }
  .gg-close-o::after,
  .gg-close-o::before {
      content: "";
      display: block;
      box-sizing: border-box;
      position: absolute;
      width: 12px;
      height: 2px;
      background: currentColor;
      transform: rotate(45deg);
      border-radius: 5px;
      top: 8px;
      left: 3px
  }
  .gg-close-o::after {
      transform: rotate(-45deg)
  }

  .gg-user-add {
      display: inline-block;
      transform: scale(var(--ggs,1));
      box-sizing: border-box;
      width: 20px;
      height: 18px;
      background:
          linear-gradient(
              to left,
              currentColor 8px,
              transparent 0)
              no-repeat 14px 6px/6px 2px,
          linear-gradient(
              to left,
              currentColor 8px,
              transparent 0)
              no-repeat 16px 4px/2px 6px
  }
  .gg-user-add::after,.gg-user-add::before {
      content: "";
      display: block;
      box-sizing: border-box;
      position: absolute;
      border: 2px solid
  }
  .gg-user-add::before {
      width: 8px;
      height: 8px;
      border-radius: 30px;
      top: 0;
      left: 2px
  }
  .gg-user-add::after {
      width: 12px;
      height: 9px;
      border-bottom: 0;
      border-top-left-radius: 3px;
      border-top-right-radius: 3px;
      top: 9px
  }

  .gg-user {
      display: inline-block;
      transform: scale(var(--ggs,1));
      box-sizing: border-box;
      width: 12px;
      height: 18px
  }
  .gg-user::after,
  .gg-user::before {
      content: "";
      display: block;
      box-sizing: border-box;
      position: absolute;
      border: 2px solid
  }
  .gg-user::before {
      width: 8px;
      height: 8px;
      border-radius: 30px;
      top: 0;
      left: 2px
  }
  .gg-user::after {
      width: 12px;
      height: 9px;
      border-bottom: 0;
      border-top-left-radius: 3px;
      border-top-right-radius: 3px;
      top: 9px
  }

  .gg-menu {
      transform: scale(var(--ggs,1))
  }
  .gg-menu,
  .gg-menu::after,
  .gg-menu::before {
      box-sizing: border-box;
      position: relative;
      display: block;
      width: 20px;
      height: 2px;
      border-radius: 3px;
      background: currentColor
  }
  .gg-menu::after,
  .gg-menu::before {
      content: "";
      position: absolute;
      top: -6px
  }
  .gg-menu::after {
      top: 6px
  }

  .gg-close {
      box-sizing: border-box;
      position: relative;
      display: block;
      transform: scale(var(--ggs,1)) scale(var(--ggs,1)) translate(-2px,5px);
      width: 22px;
      height: 22px;
      border: 2px solid transparent;
      border-radius: 40px
  }
  .gg-close::after,
  .gg-close::before {
      content: "";
      display: block;
      box-sizing: border-box;
      position: absolute;
      width: 16px;
      height: 2px;
      background: currentColor;
      transform: rotate(45deg);
      border-radius: 5px;
      top: 8px;
      left: 1px
  }
  .gg-close::after {
      transform: rotate(-45deg)
  }

  .gg-link {
      box-sizing: border-box;
      position: relative;
      display: inline-block;
      -moz-transform: rotate(-45deg) scale(var(--ggs,1));
      transform: translate(4px,1px) rotate(-45deg) scale(var(--ggs,1));
      width: 8px;
      height: 2px;
      background: currentColor;
      line-height:11px;
      border-radius: 4px
  }
  .gg-link::after,
  .gg-link::before {
      content: "";
      display: block;
      box-sizing: border-box;
      position: absolute;
      border-radius: 3px;
      width: 8px;
      height: 10px;
      border: 2px solid;
      top: -4px
  }
  .gg-link::before {
      border-right: 0;
      border-top-left-radius: 40px;
      border-bottom-left-radius: 40px;
      left: -6px
  }
  .gg-link::after {
      border-left: 0;
      border-top-right-radius: 40px;
      border-bottom-right-radius: 40px;
      right: -6px
  }

  .gg-info {
      box-sizing: border-box;
      position: relative;
      display: inline-block;
      transform: scale(var(--ggs,1)) translate(-3px, 3px);
      width: 20px;
      height: 20px;
      border: 2px solid;
      border-radius: 40px
  }
  .gg-info::after,
  .gg-info::before {
      content: "";
      display: block;
      box-sizing: border-box;
      position: absolute;
      border-radius: 3px;
      width: 2px;
      background: currentColor;
      left: 7px
  }
  .gg-info::after {
      bottom: 2px;
      height: 8px
  }
  .gg-info::before {
      height: 2px;
      top: 2px
  }

  .gg-yinyang {
    box-sizing: border-box;
    position: relative;
    display: inline-block;
    transform: rotate(95deg) scale(var(--ggs,1)) translate(4px,4px); 
    width: 20px;
    height: 20px;
    border: 2px solid;
    border-radius: 22px
  }
  .gg-yinyang::after,
  .gg-yinyang::before {
    content: "";
    display: block;
    box-sizing: border-box;
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 10px;
    top: 4px
  }
  .gg-yinyang::before {
    border: 2px solid;
    left: 0
  }
  .gg-yinyang::after {
    border: 2px solid transparent;
    right: 0;
    box-shadow:
      inset 0 0 0 4px,
      0 -3px 0 1px,
      -2px -4px 0 1px,
      -8px -5px 0 -1px,
      -11px -3px 0 -2px,
      -12px -1px 0 -3px,
      -6px -6px 0 -1px
  }

  .gg-image {
      box-sizing: border-box;
      position: relative;
      display: inline-block;
      transform: scale(var(--ggs,1)) translate(1px,2px); 
      width: 20px;
      height: 16px;
      overflow: hidden;
      box-shadow: 0 0 0 2px;
      border-radius: 2px
  }
  .gg-image::after,
  .gg-image::before {
      content: "";
      display: block;
      box-sizing: border-box;
      position: absolute;
      border: 2px solid
  }
  .gg-image::after {
      transform: rotate(45deg);
      border-radius: 3px;
      width: 16px;
      height: 16px;
      top: 9px;
      left: 6px
  }
  .gg-image::before {
      width: 6px;
      height: 6px;
      border-radius: 100%;
      top: 2px;
      left: 2px
  }
  .gg-serverless {
      box-sizing: border-box;
      position: relative;
      display: inline-block;
      transform: scale(var(--ggs,1)) translate(2px,1px); 
      width: 15px;
      height: 13px;
      overflow: hidden
  }
  .gg-serverless::after,
  .gg-serverless::before {
      background: currentColor;
      content: "";
      box-sizing: border-box;
      position: absolute;
      display: block;
      height: 3px;
      box-shadow: 0 5px 0,0 10px 0;
      transform: skew(-20deg)
  }
  .gg-serverless::before {
      width: 8px;
      left: -2px
  }
  .gg-serverless::after {
      width: 12px;
      right: -5px
  }
  .gg-software-download {
      box-sizing: border-box;
      position: relative;
      display: inline-block;
      transform: scale(var(--ggs,1)) translate(3px,9px); 
      width: 16px;
      height: 6px;
      border: 2px solid;
      border-top: 0;
      border-bottom-left-radius: 2px;
      border-bottom-right-radius: 2px;
      line-height:15px;
  }
  .gg-software-download::after {
      content: "";
      display: block;
      box-sizing: border-box;
      position: absolute;
      width: 8px;
      height: 8px;
      border-left: 2px solid;
      border-bottom: 2px solid;
      transform: rotate(-45deg);
      left: 2px;
      bottom: 4px
  }
  .gg-software-download::before {
      content: "";
      display: block;
      box-sizing: border-box;
      position: absolute;
      border-radius: 3px;
      width: 2px;
      height: 10px;
      background: currentColor;
      left: 5px;
      bottom: 5px
  }
  .gg-arrow-left-r {
      box-sizing: border-box;
      position: relative;
      display: inline-block;
      width: 22px;
      height: 22px;
      border: 2px solid;
      transform: scale(var(--ggs,1));
      border-radius: 4px
  }
  .gg-arrow-left-r::after,
  .gg-arrow-left-r::before {
      content: "";
      display: block;
      box-sizing: border-box;
      position: absolute;
      left: 4px
  }
  .gg-arrow-left-r::after {
      width: 6px;
      height: 6px;
      border-bottom: 2px solid;
      border-left: 2px solid;
      transform: rotate(45deg);
      bottom: 6px
  }
  .gg-arrow-left-r::before {
      width: 10px;
      height: 2px;
      bottom: 8px;
      background: currentColor
  }
  </style>
`
