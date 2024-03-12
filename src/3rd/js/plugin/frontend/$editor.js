// reactive component for displaying the menu 
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
    return this
  },

  editNode(){
    if( !this.enabled ) return console.log("not editing")
    console.log("click!")
    $editor.enabled = false     // disable selections
    this.enableHref(this.selected,true) // re-enable hrefs 
    notify(`${this.selected.name}<br>${this.getMetaData(this.selected)}`)
    notify(`<b>XR Fragment:</b> #${this.selected.name}<br><br>${this.getMetaData(this.selected)}`)
  },

  initEdit(scene){
    AFRAME.scenes[0].addEventListener('click', () => this.editNode() )
    scene.traverse( (n) => {
      let highlight = (n) => (e) => {
        console.log(n.name)
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
        notify(`<b>XR Fragment:</b> #${n.name}<br><br>${this.getMetaData(this.selected)}`)

        this.enableHref(n,false) // prevent clicks from doing their usual teleporting/executions
      }
      if( n.geometry ) n.addEventListener('mousemove', n.highlightOnMouseMove = highlight(n) )
    }) 
    console.log("inited scene")
  },

  getMetaData(n){
    return `href: ${n.userData.href}<br>src: ${n.userData.src}<br>tag: ${n.userData.tag}`
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
  }

},
{

  get(me,k,v){ return me[k] },

  set(me,k,v){ 
    me[k] = v    
    switch( k ){

      case "enabled":{ 
          if( v ){
            notify("click an object to reveal XR Fragment metadata")
            xrf.interactive.raycastAll = true
            if( !xrf.scene.initEdit ) me.initEdit(xrf.scene)
          }else{
            console.log("idsabled")
            xrf.scene.traverse( (n) => {
              me.enableHref(n,true)
              if( n.highlightOnMouseMove ){
               n.removeEventListener( 'mousemove', n.highlightOnMouseMove )    
              }
            })
            me.helper.remove()
            console.log("removed events")
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
