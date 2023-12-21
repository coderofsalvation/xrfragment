MEETING = {

  html: `
     <div id="videos" style="pointer-events:none"></div>
     <div id="chat" aria-live="assertive" aria-relevant></div>
     <div id="chatfooter">
       <div id="chatbar">
           <input id="chatline" type="text" placeholder=""></input>
       </div>
       <button id="showchat" class="btn">show chat</button>
     </div>
    </div>
  `,

  init: (el) => new Proxy({

    scene:    null,
    visible:  false,
    //$overlay: $overlay = el.querySelector('#overlay'),
    //
    install(opts){
      this.scene = opts.scene 

      document.body.appendChild( el )
      document.dispatchEvent( new CustomEvent("MEETING:ready", {detail: opts}) )
    },

    start(){
      this.scene.addEventListener('meeting.peer.add',    () => console.log("$meeting.peer.add") )
      this.scene.addEventListener('meeting.peer.remove', () => console.log("$meeting.peer.remove") )
    },

    toggle:   () => MEETING.visible = !MEETING.visible,

  },{

    get(data,k,v){ return data[k] },
    set(data,k,v){ 
      data[k] = v    
      switch( k ){
        case "visible": el.style.display = data.visible ? 'block' : 'none'
      }
    },

  })
}

// reactify component!
document.addEventListener('XRFMENU:ready', (opts) => {
  opts = opts.detail
  XRFMENU.buttons = ([`<a class="btn" aria-label="button" aria-description="start text/audio/video chat" id="meeting" onclick="MEETING.toggle()" target="_blank">🧑‍🤝‍🧑 meeting</a><br>`])
                    .concat(XRFMENU.buttons)
  document.head.innerHTML += MEETING.css 
  $meeting = document.createElement('div')
  $meeting.innerHTML = MEETING.html
  MEETING = MEETING.init($meeting)
  MEETING.install(opts)
})

// alpine component for displaying meetings

MEETING.css = `
    <style type="text/css">
     #videos{
       display:grid-auto-columns;
       grid-column-gap:5px;
       margin-bottom:15px;
       position: fixed;
       top: 0;
       left: 0;
       bottom: 0;
       right: 0;
       margin: 15px;
       z-index:1500;
     }
     #videos > video{
       border-radius:7px;
       display:inline-block;
       background:black;
       width:80px;
       height:60px;
       margin-right:5px;
       margin-bottom:5px;
       vertical-align:top;
       pointer-events:all;
     }
     #videos > video:hover{
       filter: brightness(1.8);
       cursor:pointer;
     }

     #chatbar,
     button#showchat{
       z-index: 1500;
       position: fixed;
       bottom: 20px;
       left: 20px;
       width: 48%;
       background: white;
       padding: 0px 0px 0px 15px; 
       border-radius: 30px;
       max-width: 500px;
       box-sizing: border-box;
       box-shadow: 0px 0px 5px 5px #0002;
     }
     button#showchat{
       z-index:1550;
       color:white;
       border:0;
       display:none;
       height: 44px;
       background:#07F;
       font-weight:bold;
     }
     #chatbar input{
       border:none;
       width:90%;
       box-sizing:border-box;
     }
     #chat{
       position: absolute;
       top: 100px;
       left: 0;
       right: 0;
       bottom: 88px;
       padding: 15px;
       pointer-events: none;
       overflow-y:auto;
     }
     #chat .msg{
       background: #fff;
       display: inline-block;
       padding: 6px 17px;
       border-radius: 20px;
       color: #000c;
       margin-bottom: 10px;
       line-height:23px;
       pointer-events:visible;
       border: 1px solid #ccc;
     }
     #chat .msg.info{
       background: #333;
       color: #FFF;
       font-size: 14px;
       padding: 0px 16px;
     }
     #chat .msg.info a,
     #chat .msg.info a:visited{
       color: #aaf;
       text-decoration: none;
       transition:0.3s;
     }
     #chat .msg.info a:hover,
     #chat button:hover{
       filter: brightness(1.8);
       text-decoration: underline;
     }
     #chat button {
       margin: 0px 15px 10px 0px;
       background: #07F;
       color: #FFF;
       border-radius: 7px;
       padding: 11px 15px;
       border: 0;
       font-weight: bold;
       box-shadow: 0px 0px 5px 5px #0002;
       pointer-events:all;
     }
     #chat,#chatbar,#chatbar *, #chat *{
       font-family:monospace;
       font-size:15px;
     }
   </style>`
