window.matrix = (opts) => new Proxy({

  plugin:{
    type: 'network',
    name: '[matrix] channel',
    description: '[matrix] is a standardized decentralized privacy-friendly protocol',
    url: 'https://matrix.org',
    video: false,
    audio: false,
    chat: true,
    scene: true
  },

  html: {
    generic: (opts) => `<table>
          <tr>
            <td><a href="${opts.url}" target="_blank" class="badge">matrix</a></td>
            <td>
              <input type="text" id="channelname" placeholder="channel name"/>
            </td>
          </tr>
        </table>
      </div>
    `
  },

  init(){
    let network = window.network
    network.plugin['matrix'] = this
    $connections.chatnetwork = $connections.chatnetwork.concat([this])
    $connections.scene       = $connections.scene.concat([this])
  },

  config(opts){
    opts = {...opts, ...this.plugin }
    let el   = document.createElement('div')
    let html = this.html.generic(opts)
    for( let i in opts ){
      if( this.html[i] ) html += this.html[i](opts)
    }
    el.innerHTML = html
    el.querySelector('.badge').addEventListener('mouseover', () => {
      window.notify(`${opts.name} is ${opts.description}.<br>You can basically make up a new channelname or use an existing one`)
    })
    return el
  }
},
{ 
  // auto-trigger events on changes 
  get(data,k,receiver){ return data[k] },
  set(data,k,v){
    let from   = data[k]
    data[k] = v
    switch( k ){
      default: matrix.opts.scene.dispatchEvent({type:`matrix.${k}.change`, from, to:v})
    }
  }
})
      
document.addEventListener('$connections:ready', (e) => {
  matrix(e.detail).init()
})

