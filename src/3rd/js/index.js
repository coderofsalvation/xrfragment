// SPDX-License-Identifier: MPL-2.0        
// Copyright (c) 2023 Leon van Kammen/NLNET 

var xrf = {}

xrf.init = function(opts){
  opts = opts || {}
  xrf.Parser.debug = xrf.debug 
  for ( let i in opts    ) xrf[i] = opts[i]
  xrf.emit('init',opts)
  return xrf.query
}

xrf.query = function(){
  // framework implementations can override this function, see src/3rd/js/three/index.sj 
  alert("queries are not implemented (yet) for this particular framework")
}

// map library functions to xrf
for ( let i in xrfragment ) xrf[i] = xrfragment[i] 
