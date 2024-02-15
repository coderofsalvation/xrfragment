xrf.frag.uv = function(v, opts){
  let { frag, mesh, model, camera, scene, renderer, THREE} = opts

  if( !mesh.geometry ) return // nothing to do here
  if( v.floats.length != 4 ) return console.warn('xrfragment.js: got less than 4 uv values ')

  xrf.frag.uv.init(mesh)
  mesh.uv.u      = v.floats[0]
  mesh.uv.v      = v.floats[1]
  mesh.uv.uspeed = v.floats[2] || 1.0
  mesh.uv.vspeed = v.floats[3] || 1.0
  mesh.uv.ushift = v.shift[0]  || v.floats[0] < 0  // negative u is always relative 
  mesh.uv.vshift = v.shift[1]  || v.floats[1] < 0  // negative v is always relative
  mesh.uv.uloop  = v.shift[2]  || false
  mesh.uv.vloop  = v.shift[3]  || false

  mesh.onBeforeRender = xrf.frag.uv.scroll
}

xrf.frag.uv.init = function(mesh){
  if( !mesh.uv  ) mesh.uv   = {u:0, v:0, uspeed:1, vspeed:1, uloop:false, vloop:false, uv:false}

  let uv    = mesh.geometry.getAttribute("uv")
  if( !uv.old ) uv.old = mesh.geometry.getAttribute("uv").clone()
}

xrf.frag.uv.scroll = function(){

  let diffU  = 0.0 // distance to end-state (non-looping mode)
  let diffV  = 0.0 // distance to end-state (non-looping mode)
  let uv     = this.geometry.getAttribute("uv")

  // translate!
  for( let i = 0; i < uv.count; i++ ){

    if( this.uv.uspeed == 1.0 ) uv.setX(i, this.uv.ushift ? uv.getX(i) + this.uv.u : uv.old.getX(i) + this.uv.u )
    if( this.uv.vspeed == 1.0 ) uv.setY(i, this.uv.vshift ? uv.getY(i) + this.uv.v : uv.old.getY(i) + this.uv.v )

    if( this.uv.uloop || this.uv.vloop ){
      let u         = uv.getX(i)     
      let v         = uv.getY(i)     
      let uTarget   = this.uv.ushift ? uv.getX(i) + this.uv.u : uv.old.getX(i) + this.uv.u
      let vTarget   = this.uv.vshift ? uv.getY(i) + this.uv.v : uv.old.getY(i) + this.uv.v

      // scroll U
      if( this.uv.uloop ){
        u += this.uv.uspeed * xrf.clock.delta
      }else{
        // *TODO* tween to offset
        //// recover from super-high uv-values due to looped scrolling
        //if( Math.abs(u-uTarget) > 10.0 ) u = uv.old.getX(i)
        //u = u > uTarget ?  u + (this.uv.uspeed * -xrf.clock.delta)
        //                :  u + (this.uv.uspeed *  xrf.clock.delta) 
        //diffU += Math.abs( u - uTarget )  // are we done yet? (non-looping mode)
      } 

      // scroll V
      if( this.uv.vloop ){
        v += this.uv.vspeed * xrf.clock.delta
      }else{
        // *TODO* tween to offset
        //// recover from super-high uv-values due to looped scrolling
        //// recover from super-high uv-values due to looped scrolling
        //if( Math.abs(v-vTarget) > 10.0 ) v = uv.old.getY(i)
        //v = v > vTarget ?  v + (this.uv.vspeed * -xrf.clock.delta)
        //                :  v + (this.uv.vspeed *  xrf.clock.delta) 
        //diffV += Math.abs( v - vTarget )
      }
      uv.setXY(i,u,v)
    }

  }
  uv.needsUpdate = true

  if( (!this.uv.uloop && diffU < 0.05) &&
      (!this.uv.vloop && diffV < 0.05)
  ){ // stop animating if done
    this.onBeforeRender = function(){}
  }
}
