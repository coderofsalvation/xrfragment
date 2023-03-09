
// in the browser use this instead of require():
// 
//   <script src="Query.js"></script>
//	 <script>
//	    var q = new hgltf.Query()
//   </script>

var hgltf = require('../Query').hgltf
var q     = new hgltf.Query()


var res = q.parse("") 
if( !res.copy_all ) throw 'empty string should always set copy_all to true'

console.log( q.parse("") )
console.log( JSON.stringify(q.parse("foo:*"), null, 2) )
return
console.log( q.parse("-skybox -plane") )
console.log( q.parse("foo or bar") );
console.log( q.parse("class:fopoer or bar foo:bar").or[0] );
console.log( q.parse("-skybox class:foo").or[0] );
console.log( q.parse("foo/flop moo or bar").or[0] );
console.log( q.parse("-foo/flop moo or bar").or[0] );
console.log( q.parse("price:>4 moo or bar").or[0] );
console.log( q.parse("price:>=4 moo or bar").or[0] );
console.log( q.parse("price:<=4 moo or bar").or[0] );
console.log( q.parse("price:!=4 moo or bar").or[0] );
