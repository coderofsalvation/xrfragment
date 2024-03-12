// reactive component for displaying the menu 

$editorPopup = (el) => new Proxy({

  html: (opts) => `
    <div>
      <b>#${$editor.selected.name}</b>
      <table class="editorPopup">
        <tbody>
          <tr>
            <td><b class="badge">href</a></td>
            <td>
              <input type="text" id="href" placeholder="https://foo.com" maxlength="255" 
                     onkeyup="$editor.selected.edited = $editor.selected.userData.href = this.value" 
                     value="${$editor.selected.userData.href||''}" />
            </td>
          </tr>
          <tr>
            <td><b class="badge">src</a></td>
            <td>
              <input type="text" id="src" placeholder="https://foo.com" maxlength="255" 
                     onkeyup="$editor.selected.edited = $editor.selected.userData.src = this.value" 
                     value="${$editor.selected.userData.src||''}" />
            </td>
          </tr>
          <tr>
            <td><b class="badge">tag</a></td>
            <td>
              <input type="text" id="tag" placeholder="foo bar" maxlength="255" 
                     onkeyup="$editor.selected.edited = $editor.selected.userData.tag = this.value" 
                     value="${$editor.selected.userData.tag||''}" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <style type="text/css">
      table.editorPopup input{
        min-width:200px;
      }
    </style>
  `,

  init(opts){
    el.innerHTML = this.html(opts)
    return el
  },

},{

  get(me,k,v){ return me[k] },

  set(me,k,v){ 
    me[k] = v    
  }

})


$editor = (el,opts) => new Proxy({

  html: `
    <div style="position:absolute; width:100%; text-align:right; right:166px;">
      <button class="btn edit-btn">
        <i class="gg-pen"></i>
      </button>
    </div>
    <style type="text/css">
      .xrf button.edit-btn{
        height: 32px;
        width: 30px;
        margin-top: 7px;
      }
      .edit-btn.enabled,
      .edit-btn.enabled:hover{
        background:black;
      }
      .edit-btn i.gg-pen{
         margin-top: -26px;
         margin-left: 4px;
         width: 10px;
         color: var(--xrf-white); 
      }
    </style>
  `,

  enabled: false,
  helper: null,
  selected: null,

  init(opts){
    el.innerHTML = this.html
    window.frontend.el.querySelector('#topbar').appendChild(el);
    el.querySelector('.edit-btn').addEventListener('click', () =>  $editor.enabled = true )

    document.addEventListener('download', (e) => this.updateOriginalScene(e.detail) )
    return this
  },

  editNode(){
    if( !this.enabled ) return console.log("not editing")
    $editor.enabled = false             // disable selections
    this.enableHref(this.selected,true) // re-enable hrefs 
      //`<b>XR Fragment:</b> #${this.selected.name}<br><br>${this.getMetaData(this.selected)}`),{
    notify( $editorPopup( document.createElement('div') ).init(this) , {
      timeout:false,
      onclose: () => xrf.scene.remove( this.helper )
    })
  },

  initEdit(scene){
    AFRAME.scenes[0].addEventListener('click', () => this.editNode() )
    scene.traverse( (n) => {
      let highlight = (n) => (e) => {
        if( this.selected ) this.enableHref(this.selected,true) // re-enable href of previous selection
        if( this.helper){
          if( this.helper.selected == n.uuid ) return // already selected
          xrf.scene.remove(this.helper)
        }
        if( !this.enabled ) return // do nothing

        this.selected = n
        this.helper = new THREE.BoxHelper( n, 0xFF00FF )
        this.helper.material.linewidth = 5
        this.helper.material.color = xrf.focusLine.material.color
        this.helper.selected = n.uuid
        xrf.scene.add(this.helper)

        let div = document.createElement('div')
        notify(`<b>#${n.name}</b><br>${this.getMetaData(this.selected)}`)

        this.enableHref(n,false) // prevent clicks from doing their usual teleporting/executions
      }
      if( n.material ) n.addEventListener('mousemove', n.highlightOnMouseMove = highlight(n) )
    }) 
    console.log("inited scene")
  },

  getMetaData(n){
    let html = `${n.userData.href ? `<b class="badge">href</b>${n.userData.href}<br>`:''}`
    html    += `${n.userData.src  ? `<b class="badge">src</b>${n.userData.src}<br>`  :''}` 
    html    += `${n.userData.tag  ? `<b class="badge">tag</b>${n.userData.tag}<br>`  :''}` 
    return html
  },

  enableHref(n, state){
    if( n.userData.XRF && n.userData.XRF.href && n.userData.XRF.href.exec ){
      let exec = n.userData.XRF.href.exec
      if( !state && !exec.bak ){
        exec.bak = exec
        n.userData.XRF.href.exec = function(){}
      }
      if( state && exec.bak ){
        n.userData.XRF.href.exec = exec.bak
      }
    }
  },

  updateOriginalScene(opts){
    let {scene,ext} = opts
    xrf.scene.traverse( (n) => {
      if( n.edited && scene.getObjectByName(n.name) ){
        scene.getObjectByName(n.name).userData = n.userData
      }
    })
  }

},
{

  get(me,k,v){ return me[k] },

  set(me,k,v){ 
    me[k] = v    
    switch( k ){

      case "enabled":{ 
          lookctl = $('[look-controls]').components['look-controls']
          if( v ){
            lookctl.pause() // prevent click-conflict
            notify("click an object to reveal XR Fragment metadata")
            xrf.interactive.raycastAll = true
            if( !xrf.scene.initEdit ) me.initEdit(xrf.scene)

            lookctl.pause() // prevent click-conflict
            el.querySelector('.edit-btn').classList.add(['enabled'])
          }else{
            lookctl.pause() // prevent click-conflict
            xrf.scene.traverse( (n) => {
              me.enableHref(n,true)
              if( n.highlightOnMouseMove ){
               n.removeEventListener( 'mousemove', n.highlightOnMouseMove )    
              }
            })
            lookctl.play() // prevent click-conflict (resume)
            el.querySelector('.edit-btn').classList.remove(['enabled'])
          }
          break;
      }
    }
  },

})

// reactify component!
document.addEventListener('frontend:ready', (e) => {
  window.$editor = $editor( document.createElement('div') ).init(e.detail)
})
