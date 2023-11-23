// test the XR Fragments parser-filters with THREEjs scns 
THREE = AFRAME.THREE

createScene = (noadd) => {
  let obj  = {a:{},b:{},c:{}}
  for ( let i in obj ){
    obj[i] = new THREE.Object3D()
    obj[i].name = i
    obj[i].material = {visible:true, clone: () => ({visible:true}) }
  }
  let {a,b,c} = obj
  let scene = new THREE.Scene()
  if( !noadd ){
    a.add(b)
    b.add(c)
    scene.add(a)
  }
  b.userData.score = 2
  b.userData.tag = "foo bar"
  c.userData.tag = "flop flap"
  a.userData.tag = "VR"
  a.userData.price = 1
  b.userData.price = 5
  c.userData.price = 10
  return {a,b,c,scene}
}

filterScene = (URI) => {
  frag = xrf.URI.parse(URI)
  var {a,b,c,scene} = createScene()
  xrf.filter.scene({scene,frag})

  scene.visible = (objname, expected, checkMaterial) => {
    let o = scene.getObjectByName(objname)
    if( !o ) return false === expected 
    let is = checkMaterial ? o.material.visible : o.visible 
    if( is !== expected ) console.dir(o)
    return is === expected
  }

  return scene
}

scn       = filterScene("#b")
test      = () => !scn.visible("a") && scn.visible("b",true) && scn.visible("c",true) 
console.assert( test(), {scn,reason:`objectname: #b `})

scn = filterScene("#-b")
test = () =>  scn.visible("a",true) && scn.visible("b",false) && scn.visible("c",false)
console.assert( test(), {scn,reason:`objectname: #-b `})

scn = filterScene("#a&-b")
test = () =>  scn.visible("a",true) && scn.visible("b",false) && scn.visible("c",false)
console.assert( test(), {scn,reason:`objectname: #a&-b `})

scn = filterScene("#-b&b") 
test = () => scn.visible("a",true) && scn.visible("b",true) && scn.visible("c",true)
console.assert( test(), {scn,reason:`objectname: #-b&b `})

scn = filterScene("#-c") 
test = () =>  scn.visible("a",true) && scn.visible("b",true) && scn.visible("c",false)
console.assert( test(), {scn,reason:`objectname: #-c `})

scn = filterScene("#score") 
test = () => scn.visible("a",true) && scn.visible("b",true) && scn.visible("c",true)
console.assert( test(), {scn,reason:`propertyfilter: #score `})

scn = filterScene("#score=>1") 
test = () => scn.visible("a",true) && scn.visible("b",true) && scn.visible("c",true)
console.assert( test(), {scn,reason:`propertyfilter: #score>=1`})

scn = filterScene("#score=2") 
test = () => scn.visible("a",true) && scn.visible("b",true) && scn.visible("c",true)
console.assert( test(), {scn,reason:`propertyfilter: #score=2`})

scn = filterScene("#score=>3") 
test = () => scn.visible("a",true) && scn.visible("b",false) && scn.visible("c",false)
console.assert( test(), {scn,reason:`propertyfilter: #score=>3`})

scn = filterScene("#-score=>1") 
test = () => scn.visible("a",true) && scn.visible("b",false) && scn.visible("c",false)
console.assert( test(), {scn,reason:`propertyfilter: #-score=>1`})

scn = filterScene("#-score=>1&c") 
test = () => scn.visible("a",true) && scn.visible("b",true) && scn.visible("b",false,true) && scn.visible("c",true)
console.assert( test(), {scn,reason:`propertyfilter: #-score=>1&c`})

scn = filterScene("#-foo")
test = () => scn.visible("a",true) && scn.visible("b",false) && scn.visible("b",false)
console.assert( test(), {scn,reason:`tagfilter: #-foo `})

scn = filterScene("#-c&flop")
test = () => scn.visible("a",true) && scn.visible("b",true) && scn.visible("c",true)
console.assert( test(), {scn,reason:`tagfilter: #-c&flop`})

scn = filterScene("#-b&-foo&bar&flop")
test = () => scn.visible("a",true) && scn.visible("b",true) && scn.visible("c",true)
console.assert( test(), {scn,reason:`tagfilter: #-b&-foo&bar&flop`})

scn = filterScene("#-b&-foo&bar&flop&-bar&flop")
test = () => scn.visible("a",true) && scn.visible("b",false,true) && scn.visible("c",true)
console.assert( test(), {scn,reason:`tagfilter: #-b&-foo&bar&flop&-bar&flop"`})

scn = filterScene("#-price&price=>5")
test = () => scn.visible("a",false,true) && scn.visible("b",true) && scn.visible("c",true)
console.assert( test(), {scn,reason:`tagfilter: #-price&price=>5"`})

scn = filterScene("#-/VR&b")
test = () => scn.visible("a",false,true) && scn.visible("b",true) && scn.visible("c",true)
console.assert( test(), {scn,reason:`tagfilter: #-/VR&b"`})
