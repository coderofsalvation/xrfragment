/* 
 * (promise-able) EVENTS (optionally continue after listeners are finished using .then)
 *
 * example:
 *
 *  xrf.addEventListener('foo',(e) => {
 *    // let promise = e.promise()   
 *    console.log("navigating to: "+e.detail.destination.url)
 *    // promise.resolve()
 *    // promise.reject("not going to happen")
 *  })
 *
 *  xrf.emit('foo',123)
 *  xrf.emit('foo',123).then(...).catch(...).finally(...)
 */

xrf.addEventListener = function(eventName, callback, opts) {
  if( !this._listeners ) this._listeners = []
  callback.opts = opts || {weight: this._listeners.length}
  if (!this._listeners[eventName]) {
      // create a new array for this event name if it doesn't exist yet
      this._listeners[eventName] = [];
  }
  // add the callback to the listeners array for this event name
  this._listeners[eventName].push(callback);
  // sort
  this._listeners[eventName] = this._listeners[eventName].sort( (a,b) => a.opts.weight > b.opts.weight )
  return () => {
    this._listeners[eventName] = this._listeners[eventName].filter( (c) => c != callback )
  }
};

xrf.emit = function(eventName, data){
  if( typeof data != 'object' ) throw 'emit() requires passing objects'
  if( xrf.debug && ( !eventName.match(/^render/) || xrf.debug == eventName ) ){
    let label = String(`xrf.emit('${eventName}')`).padEnd(35," ");
    label +=  data.mesh && data.mesh.name ? '#'+data.mesh.name : ''
    console.groupCollapsed(label)
    console.info(data)
    console.groupEnd(label)
    if( xrf.debug > 1 ) debugger
  }
  return xrf.emit.promise(eventName,data)
}

xrf.emit.normal = function(eventName, data) {
    if( !xrf._listeners ) xrf._listeners = []
    var callbacks = xrf._listeners[eventName]
    if (callbacks) {
        for (var i = 0; i < callbacks.length; i++) {
          try{
            callbacks[i](data);
          }catch(e){ console.error(e) }
        }
    }
};

xrf.emit.promise = function(e, opts){ 
  return new Promise( (resolve, reject) => {
    opts.promise = () => {
      opts.promises = opts.promises || []
      opts.promises.push(0)
      return { 
        resolve: ((index) => () => {
          opts.promises[index] = 1 
          let succesful = opts.promises.reduce( (a,b) => a+b )
          if( succesful == opts.promises.length ) resolve(opts)
        })(opts.promises.length-1),
        reject: console.error
      }
    }
    xrf.emit.normal(e, opts)     
    if( !opts.promises ) resolve(opts)
    delete opts.promise
  })
}

xrf.addEventListener('reset', () => {
// *TODO* do this nicely
//  xrf._listeners['renderPost'] = []
//  xrf._listeners['render'] = []
})
