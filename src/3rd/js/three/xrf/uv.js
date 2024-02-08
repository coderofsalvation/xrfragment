xrf.frag.uv = function(v, opts){
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts

  if( !mesh.geometry ) return // nothing to do here

  xrf.frag.uv.init(mesh)
  mesh.uv.x    = v.x
  mesh.uv.y    = v.y !== undefined ? v.y : v.x
  mesh.onBeforeRender = xrf.frag.uv.scroll
}

xrf.frag.uv.init = function(mesh){
  if( !mesh.uv  ) mesh.uv   = {x:0, y:0, w:1, h:1, uv:false}
  if( !mesh.suv ) mesh.suv  = {x:1, y:1, loop:false }
  let uv    = mesh.geometry.getAttribute("uv")
  if( !uv.old ) uv.old = uv.clone()
}

xrf.frag.uv.scroll = function(){
  if( this.suv.x > 0.0 || this.suv.y > 0.0 ){

    let diff   = 0.0 // distance to end-state (non-looping mode)
    let uv     = this.geometry.getAttribute("uv")

    // translate!
    for( let i = 0; i < uv.count; i++ ){
      let u         = uv.getX(i)     
      let v         = uv.getY(i)     
      let uTarget   = uv.old.getX(i) + this.uv.x
      let vTarget   = uv.old.getY(i) + this.uv.y

      if( this.suv.loop ){
        u += this.suv.x * xrf.clock.delta
        v += this.suv.y * xrf.clock.delta
      }else{

        // recover from super-high uv-values due to looped scrolling
        if( Math.abs(u-uTarget) > 1.0 ) u = uv.old.getX(i)
        if( Math.abs(v-vTarget) > 1.0 ) v = uv.old.getY(i)

        u = u > uTarget ?  u + (this.suv.x * -xrf.clock.delta)
                        :  u + (this.suv.x *  xrf.clock.delta) 
        v = v > vTarget ?  v + (this.suv.y * -xrf.clock.delta)
                        :  v + (this.suv.y *  xrf.clock.delta) 
        diff += Math.abs( u - uTarget )  // are we done yet? (non-looping mode)
        diff += Math.abs( v - vTarget )

      }
      uv.setXY(i,u,v)
    }
    uv.needsUpdate = true

    if( !this.suv.loop && diff < 0.05 ){ // stop animating if done
      this.onBeforeRender = function(){}
    }
  }
}
