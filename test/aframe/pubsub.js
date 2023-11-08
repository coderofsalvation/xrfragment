
// test simple event
opts = {a:0}
xrf.addEventListener('foo1', (opts) => opts.a = 1 )
xrf.emit('foo1',opts)
setTimeout( () => console.assert( opts.a, {opts, reason:"xrf.emit('foo1',...) should set a to 1"}), 100)

// test simple promise event
opts = {a:0}
xrf.addEventListener('foo2', (e) => {
  let p = e.promise()
  e.a = 1
  p.resolve(e)
})
xrf.emit('foo2',opts)
.then( (opts) => {
  console.assert( opts.a, {opts, reason:"xrf.emit('foo2',...) should set a to 1 via promise"})
})

// test multiple promise event 
opts = {a:""}
xrf.addEventListener('foo3', (e) => {
  let p = e.promise()
  setTimeout( () => {
    e.a += "1"
    p.resolve(e)
  }, 100 )
})
xrf.addEventListener('foo3', (e) => {
  let p = e.promise()
  e.a += "2"
  p.resolve(e)
})
xrf.emit('foo3',opts)
.then( (opts) => {
  opts.a += "3"
  console.assert( opts.a == "213", {opts, reason:"xrf.emit('foo3',...) should support multiple promise listeners"})
})
