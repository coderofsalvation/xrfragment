// reactive component for displaying the menu 
menuComponent = (el) => new Proxy({

  html: `
    <div class="xrf footer">
      <div class="menu">
        <div id="buttons"></div>
        <a class="btn" id="more" aria-title="menu button"><i id="icon" class="gg-menu"></i></a><br>
      </div>
    </div>
  `,

  collapsed:    false,
  logo:       './../../assets/logo.png',
  buttons:    [`<a class="btn" aria-label="button" aria-title="share button" aria-description="this allows embedding and sharing of this URL or make a screenshot of it"  id="share"   onclick="frontend.share()"><i class="gg-link"></i>&nbsp;share</a><br>`],
  $buttons:   $buttons = el.querySelector('#buttons'),
  $btnMore:   $btnMore = el.querySelector('#more'),

  toggle(state){   
    this.collapsed = state !== undefined ? state : !this.collapsed 
    el.querySelector("i#icon").className = this.collapsed ? 'gg-close' : 'gg-menu'
    document.body.classList[ this.collapsed ? 'add' : 'remove' ](['menu'])
  },

  init(opts){
    el.innerHTML = this.html
    document.body.appendChild(el);
    (['click']).map( (e) => el.addEventListener(e, (ev) => this[e] && this[e](ev.target.id,ev) ) )
    setTimeout( () => {
      document.dispatchEvent( new CustomEvent("$menu:ready", {detail: {$menu:this,xrf}}) )
    },100)
    return this
  },

  click(id,e){
    switch(id){
      case "icon":
      case "more": this.toggle(); break;
    }
  }
},
{

  get(me,k,v){ return me[k] },

  set(me,k,v){ 
    me[k] = v    
    switch( k ){
      case "buttons":    el.querySelector("#buttons").innerHTML = this.renderButtons(me); 
                         document.dispatchEvent( new CustomEvent("$menu:buttons:render", {detail: el.querySelector('.menu') }) )
                         break;
      case "collapsed":  
                         el.querySelector("#buttons").style.display = me.collapsed ? 'block' : 'none'
                         frontend.emit('$menu:collapse', v)
                         break;
    }
  },

  renderButtons: (data) => `${data.buttons.join('')}`

})

// reactify component!
document.addEventListener('frontend:ready', (e) => {
  window.$menu = menuComponent( document.createElement('div') ).init(e.detail)
})
