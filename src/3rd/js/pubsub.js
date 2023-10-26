/* 
 * (promise-able) EVENTS
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

xrf.addEventListener = function(eventName, callback, scene) {
    if( !this._listeners ) this._listeners = []
    if (!this._listeners[eventName]) {
        // create a new array for this event name if it doesn't exist yet
        this._listeners[eventName] = [];
    }
    if( scene ) callback.scene = scene
    // add the callback to the listeners array for this event name
    this._listeners[eventName].push(callback);
};

xrf.removeEventListeners = function( everything ){
  if( everything ) this._listeners = []
  else{
    for( let eventName in this._listener ){
      this._listener[eventName] = this._listener[eventName].filter( (e) => e.callback ? null : e )
    } 
  }
}

xrf.emit = function(eventName, data){
  if( typeof data != 'object' ) throw 'emit() requires passing objects'
  return xrf.emit.promise(eventName,data)
}

xrf.emit.normal = function(eventName, data) {
    if( !xrf._listeners ) xrf._listeners = []
    var callbacks = xrf._listeners[eventName]
    if (callbacks) {
        for (var i = 0; i < callbacks.length; i++) {
            callbacks[i](data);
        }
    }
};

xrf.emit.promise = function(e, opts){ 
  opts.XRF = xrf // always pass root XRF obj
  return new Promise( (resolve, reject) => {
    opts.promise = () => {
      opts.promise.halted = true
      return { resolve, reject }
    }
    xrf.emit.normal(e, opts)     
    delete opts.XRF
    if( !opts.promise.halted ) resolve()
    delete opts.promise
  })
}
