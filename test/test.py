from Query import hgltf_Query

q = hgltf_Query()

print( q.parse("foo or bar") )
print( q.parse("foo or bar") )
print( q.parse("class:fopoer or bar foo:bar") )
print( q.parse("-skybox class:foo") )
print( q.parse("foo/flop moo or bar") )
print( q.parse("-foo/flop moo or bar") )
print( q.parse("price:>4 moo or bar") )
print( q.parse("price:>=4 moo or bar") )
print( q.parse("price:<=4 moo or bar") )
print( q.parse("price:!=4 moo or bar") )
