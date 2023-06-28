var xrf  = require('../dist/xrfragment.three')
var test = new (require('./Test'))()

test.add("xrf.parseUrl('foo.gltf')", (next,err) => {
  let o = xrf.parseUrl('foo.gltf')
  if( o.ext  != "gltf" ) err("extension should be nothing")
  if( o.file != "foo.gltf" ) err("extension should be nothing")
  next()
})

test.add("xrf.parseUrl('https://foo.com/foo.gltf')", (next,err) => {
  let o = xrf.parseUrl('https://foo.com/foo.gltf')
  if( o.ext  != "gltf" ) err("extension should be nothing")
  if( o.file != "foo.gltf" ) err("extension should be nothing")
  next()
})

test.add("xrf.parseUrl('foo.com/foo.gltf')", (next,err) => {
  let o = xrf.parseUrl('https://foo.com/foo.gltf')
  if( o.ext  != "gltf" ) err("extension should be nothing")
  if( o.file != "foo.gltf" ) err("extension should be nothing")
  next()
})

test.run( () => console.log("done") )
