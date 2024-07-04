// SPDX-FileCopyrightText: 2023 Leon van Kammen/NLNET
//
// SPDX-License-Identifier: MPL-2.0

AFRAME.registerComponent('xrf-fade', {
  schema:{
    fadetime:{type:"number", default: 1000}, 
    color:{type:"color", default:"black"}, 
    opacity:{type:"float",default:1.0}
  },
  init: function(){
    let fb = this.fb = document.createElement("a-box")
    fb.setAttribute("scale", "1 1 1")
    fb.setAttribute("material", `color: ${this.data.color}; transparent: true; side: back; shader: flat; opacity:1`)
    this.el.appendChild(fb)
  }, 
  out: function(fadetime){
    if( fadetime != undefined ) this.data.fadetime = fadetime 
    if( this.data.opacity == 0 ) return 
    this.data.opacity = 0.0
    this.fb.setAttribute("animation", `property: components.material.material.opacity; dur: ${this.data.fadetime}; from: 1; to: ${this.data.opacity}`)
    setTimeout( () => this.fb.object3D.visible = false, this.data.fadetime )
  }, 
  "in": function(fadetime){
    if( fadetime != undefined ) this.data.fadetime = fadetime 
    if( this.data.opacity == 1 ) return 
    this.data.opacity = 1.0
    this.fb.object3D.visible = true 
    this.fb.setAttribute("animation", `property: components.material.material.opacity; dur: ${this.data.fadetime}; from: 0; to: ${this.data.opacity}`)
  }
});
