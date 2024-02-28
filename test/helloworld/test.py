from dist import xrfragment

frag = xrfragment.xrfragment_XRF.toDict( xrfragment.xrfragment_URI.parse("#pos=foo",None) )

print("hello world")
print( frag.keys() )
