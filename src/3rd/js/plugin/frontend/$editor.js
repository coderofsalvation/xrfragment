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
                     onkeydown="document.querySelector('#editActions').classList.add('show')" 
                     onkeyup="$editor.selected.edited = $editor.selected.userData.href = this.value" 
                     value="${$editor.selected.userData.href||''}" />
            </td>
          </tr>
          <tr>
            <td><b class="badge">src</a></td>
            <td>
              <input type="text" id="src" placeholder="https://foo.com" maxlength="255" 
                     onkeydown="document.querySelector('#editActions').classList.add('show')" 
                     onkeyup="$editor.selected.edited = $editor.selected.userData.src = this.value" 
                     value="${$editor.selected.userData.src||''}" />
            </td>
          </tr>
          <tr>
            <td><b class="badge">tag</a></td>
            <td>
              <input type="text" id="tag" placeholder="foo bar" maxlength="255" 
                     onkeydown="document.querySelector('#editActions').classList.add('show')" 
                     onkeyup="$editor.selected.edited = $editor.selected.userData.tag = this.value" 
                     value="${$editor.selected.userData.tag||''}" />
            </td>
          </tr>
        </tbody>
      </table>
      <br>
      <div id="editActions">
        <button class="download" onclick="$editor.export()"><i class="gg-software-download"></i> &nbsp;&nbsp;&nbsp;download scene file</button> 
        <br>
      </div>
    </div>
    <style type="text/css">
      table.editorPopup input{
        min-width:200px;
      }
      table.editorPopup tr td:nth-child(1){
        text-align:left;
      }
      #editActions{
        visibility:hidden;
      }
      #editActions.show{
        visibility:visible;
      }
    </style>
  `,

  init(opts){
    el.innerHTML = this.html(opts)
    return (this.el = el)
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

  selecting: false,
  editing: false,
  helper: null,
  selected: null,

  init(opts){
    el.innerHTML = this.html
    window.frontend.el.querySelector('#topbar').appendChild(el);
    el.querySelector('.edit-btn').addEventListener('click', () =>  {
      if( $editor.selecting || $editor.editing ) this.reset()
      else{
        $editor.selecting = true 
        $editor.editing   = false 
      }
    })

    document.addEventListener('frontend.export', (e) => this.updateOriginalScene(e.detail) )
    xrf.addEventListener('href', (opts) => {
      if( this.selecting || this.editing ) return opts.promise().reject("$editor should block hrefs while editing") // never resolve (block hrefs from interfering)
    })
    return this
  },

  reset(){
    if( this.helper) xrf.scene.remove(this.helper)
    this.selecting = false
    this.editing = false
  },

  export(){
    window.frontend.download()
    this.reset()
  },

  editNode(){
    if( !this.selecting ) return console.log("not editing")
    $editor.editing = true
      //`<b>XR Fragment:</b> #${this.selected.name}<br><br>${this.getMetaData(this.selected)}`),{
    setTimeout( () => this.reset(), 4000 )
    notify( $editorPopup( document.createElement('div') ).init(this) , {
      timeout:false,
      onclose: () => this.reset()
    })
  },

  initEdit(scene){
    if( !this.listenersInstalled ){
      AFRAME.scenes[0].addEventListener('click', () => this.editNode() )
      this.listenersInstalled = true
    }
    scene.traverse( (n) => {
      let highlight = (n) => (e) => {
        if( !this.selecting || this.editing ) return // do nothing
        if( this.helper){
          if( this.helper.selected == n.uuid ) return // already selected
          xrf.scene.remove(this.helper)
        }

        this.selected = n
        this.helper = new THREE.BoxHelper( n, 0xFF00FF )
        this.helper.material.linewidth = 4
        this.helper.material.color     = xrf.focusLine.material.color
        this.helper.material.dashSize  = xrf.focusLine.material.dashSize
        this.helper.material.gapSize   = xrf.focusLine.material.gapSize  
        this.helper.selected = n.uuid
        xrf.scene.add(this.helper)

        let div = document.createElement('div')
        notify(`<b>#${n.name}</b><br>${this.getMetaData(this.selected)}`)

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

  updateOriginalScene(e){
    const {scene,ext} = e
    scene.traverse( (n) => {
      if( !n.name ) return
      // overwrite node with modified userData from scene
      let o = xrf.scene.getObjectByName(n.name)
      if( o && o.edited ){
        for( let i in o.userData ) n.userData[i] = o.userData[i]
        console.log("updating export")
      }
    })
  }

},
{

  get(me,k,v){ return me[k] },

  set(me,k,v){ 
    me[k] = v    
    switch( k ){

      case "selecting":{ 
          lookctl = $('[look-controls]').components['look-controls']
          if( v ){
            lookctl.pause() // prevent click-conflict
            notify("click an object to reveal XR Fragment metadata")
            xrf.interactive.raycastAll = true
            me.initEdit(xrf.scene)
            lookctl.pause() // prevent click-conflict
            el.querySelector('.edit-btn').classList.add(['enabled'])
          }else{
            lookctl.pause() // prevent click-conflict
            xrf.scene.traverse( (n) => {
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
