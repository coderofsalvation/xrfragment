
// in the browser use this instead of require():
// 
//   <script src="dist/xrfragment.js"></script>
//	 <script>
//	    var XR = xrfragment;
//   </script>

var XF = require('../dist/xrfragment').xrfragment

let print = (e) => console.log( JSON.stringify(e, null, 1) + "\n" )

print( XF.URI.parse('://foo.com/1.gltf#pos=1.0,2.0,3.0&q=-.foo&t=1,100',true) );

// query
let q = new XF.Query();
print( q.parse("-.foo -plane") )
print( q.parse("price:>2")     )

frags    = XF.URI.parse('#my_view&t=1,2')
