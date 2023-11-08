
// in the browser use this instead of require():
// 
//   <script src="dist/xrfragment.js"></script>
//	 <script>
//	    var XRF = xrfragment;
//   </script>


console.assert = ((assert) => (a,b) => {
  console.log('♥ test: '+b.reason)
  assert.call( console, a, b )
})(console.assert)

/* 
 * parser checks
 */
let frags = xrf.URI.parse('://foo.com/1.gltf#pos=1.0,2.0,3.0&q=-.foo&t=1,100',true)
console.assert( frags.t, {frags, reason:'URI.parse(): t needs to be set'})

let q = new xrf.Query();
console.assert( new xrf.Query(), {reason: 'new Query() should be available'})

