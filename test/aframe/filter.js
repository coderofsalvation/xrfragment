// test the XR Fragments parser-filters with THREEjs scns 
THREE = AFRAME.THREE

createScene = (noadd) => {
  let obj  = {a:{},b:{},c:{},d:{},extembed:{}}
  for ( let i in obj ){
    obj[i] = new THREE.Object3D()
    obj[i].name = i
    obj[i].material = {visible:true, clone: () => ({visible:true}) }
  }
  let {a,b,c,d,extembed} = obj
  let scene = xrf.scene = new THREE.Scene()
  if( !noadd ){
    a.add(b)
    b.add(c)
    scene.add(a)
    extembed.add(d)
    scene.add(extembed)
  }
  b.userData.score = 2
  a.userData.tag = "VR"
  b.userData.tag = "foo hide"
  c.userData.tag = "flop flap VR"
  a.userData.price = 1
  b.userData.price = 5
  c.userData.price = 10
  b.isSRC = "local"
  d.userData.tag = "VR"
  extembed.isSRC = true 
  extembed.isSRCExternal = true 
  return {a,b,c,d,extembed,scene}
}

filterScene = (URI,opts) => {
  opts = opts || {}
  frag = xrf.URI.parse(URI).XRF
  var {a,b,c,d,extembed,scene} = createScene()
  xrf.filter.scene({...opts,scene,frag})

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
test      = () => scn.visible("a",true,true) && scn.visible("b",true) && scn.visible("c",true) 
console.assert( test(), {scn,reason:`objectname: #b `})

scn       = filterScene("#-b")
test      = () => scn.visible("a",true,true) && scn.visible("b",false,true) && scn.visible("c",true) && scn.visible("c",true,true)
console.assert( test(), {scn,reason:`objectname: #-b`})

scn       = filterScene("#-b*")
test      = () => scn.visible("a",true,true) && scn.visible("b",false,true) && scn.visible("c",false,true) 
console.assert( test(), {scn,reason:`objectname: #b*`})

scn       = filterScene("#b",{reparent:true})
test      = () => scn.visible("a",false) && scn.visible("b",true) && scn.visible("c",true) 
console.assert( test(), {scn,reason:`objectname: #b (reparent scene)`})

scn = filterScene("#-b&b*") 
test = () => scn.visible("a",true) && scn.visible("b",true) && scn.visible("c",true)
console.assert( test(), {scn,reason:`objectname: #-b&b `})

scn = filterScene("#-a&score*") 
test = () => scn.visible("a",false,true) && scn.visible("b",true,true) && scn.visible("c",true,true)
console.assert( test(), {scn,reason:`propertyfilter: #score `})

scn = filterScene("#-a&score*=2") 
test = () => scn.visible("a",false,true) && scn.visible("b",true) && scn.visible("c",true)
console.assert( test(), {scn,reason:`propertyfilter: #score=2`})

scn = filterScene("#-price*&price=>5")
test = () => scn.visible("a",false,true) && scn.visible("b",true,true) && scn.visible("c",true,true)
console.assert( test(), {scn,reason:`tagfilter: #-price&price=>5"`})

scn = filterScene("#-hide*")
test = () => scn.visible("a",true,true) && scn.visible("b",false,true) && scn.visible("c",false,true)
console.assert( test(), {scn,reason:`tagfilter: #-hide*"`})

scn  = filterScene("#-VR")
test = () => scn.visible("a",false,true) && scn.visible("b",true,true) && scn.visible("c",false,true) && scn.visible("extembed",true,true) && scn.visible("d",true,true)
console.assert( test(), {scn,reason:`tagfilter: #-VR"`})

scn  = filterScene("#-VR*")
test = () => scn.visible("a",false,true) && scn.visible("b",false,true) && scn.visible("c",false,true) && scn.visible("extembed",true,true) && scn.visible("d",true,true)
console.assert( test(), {scn,reason:`tagfilter: #-VR*"`})

