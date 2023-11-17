// test the XR Fragments parser-filters with THREEjs scenes 
THREE = AFRAME.THREE

createScene = (noadd) => {
  let obj  = {a:{},b:{},c:{}}
  for ( let i in obj ){
    obj[i] = new THREE.Object3D()
    obj[i].name = i
  }
  let {a,b,c} = obj
  let scene = new THREE.Scene()
  if( !noadd ){
    a.add(b)
    b.add(c)
    scene.add(a)
  }
  b.userData.score = 2
  return {a,b,c,scene}
}

filterScene = (URI) => {
  frag = xrf.URI.parse(URI)
  var {a,b,c,scene} = createScene()
  xrf.filter.scene({scene,frag})
  return scene
}

scene = filterScene("#b")
test = () => !scene.getObjectByName("a") && 
              scene.getObjectByName("b").visible && 
             !scene.getObjectByName("c").visible
console.assert( test(), {scene,reason:`objectname: #b => a = removed b = visible c = removed`})

scene = filterScene("#b*")
test = () => !scene.getObjectByName("a") && 
              scene.getObjectByName("b").visible && 
              scene.getObjectByName("c").visible
console.assert( test(), {scene,reason:`objectname: #b* => a = removed b = visible c = visible`})

scene = filterScene("#-b")
test = () =>  scene.getObjectByName("a").visible && 
             !scene.getObjectByName("b").visible && 
             !scene.getObjectByName("c").visible
console.assert( test(), {scene,reason:`objectname: #-b => a = visible b = invisible c = invisible`})

scene = filterScene("#a&-b")
test = () =>  scene.getObjectByName("a").visible && 
             !scene.getObjectByName("b").visible && 
             !scene.getObjectByName("c").visible
console.assert( test(), {scene,reason:`objectname: #a&-b => a = visible b = invisible c = invisible`})

scene = filterScene("#-b&b") 
test = () => !scene.getObjectByName("a") && 
              scene.getObjectByName("b").visible && 
             !scene.getObjectByName("c").visible
console.assert( test(), {scene,reason:`objectname: #-b&b => a = removed b = invisible c = invisible (last duplicate wins)`})

scene = filterScene("#-c") 
test = () =>  scene.getObjectByName("a").visible && 
              scene.getObjectByName("b").visible && 
             !scene.getObjectByName("c").visible
console.assert( test(), {scene,reason:`objectname: #-b&b => a = visible b = visible c = invisible`})

scene = filterScene("#-b*") 
test = () =>  scene.getObjectByName("a").visible && 
             !scene.getObjectByName("b").visible && 
             !scene.getObjectByName("c").visible
console.assert( test(), {scene,reason:`objectname: #-b&b => a = visible b = visible c = invisible`})

scene = filterScene("#score") 
console.dir(scene)
test = () => !scene.getObjectByName("a") && 
             scene.getObjectByName("b").visible && 
             !scene.getObjectByName("c").visible
console.assert( test(), {scene,reason:`objectname: #score => a = removed b = visible c = invisible`})

scene = filterScene("#score=>1") 
test = () => !scene.getObjectByName("a") && 
             scene.getObjectByName("b").visible && 
             !scene.getObjectByName("c").visible
console.assert( test(), {scene,reason:`objectname: #score=>1 => a = removed b = visible c = invisible`})

scene = filterScene("#score=>3") 
test = () => !scene.getObjectByName("a") && 
             !scene.getObjectByName("b").visible && 
             !scene.getObjectByName("c").visible
console.assert( test(), {scene,reason:`objectname: #score=>3 => a = invisible b = visible c = invisible`})

scene = filterScene("#score*=>1") 
test = () => !scene.getObjectByName("a") && 
              scene.getObjectByName("b").visible && 
              scene.getObjectByName("c").visible
console.assert( test(), {scene,reason:`objectname: #score*=>1 => a = invisible b = visible c = visible`})

scene = filterScene("#-score*=>1") 
test = () =>  scene.getObjectByName("a").visible && 
             !scene.getObjectByName("b").visible && 
             !scene.getObjectByName("c").visible
console.assert( test(), {scene,reason:`objectname: #-score*=>1 => a = visible b = invisible c = invisible`})

scene = filterScene("#-score*=>1&c") 
test = () =>  scene.getObjectByName("a").visible && 
             !scene.getObjectByName("b").visible && 
              scene.getObjectByName("c").visible
console.assert( test(), {scene,reason:`objectname: #-score*=>1 => a = visible b = invisible c = visible`})
