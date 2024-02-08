/* 
 * extensions: .frag/.fs/.vs/.vert
 */

xrf.frag.src.type['x-shader/x-fragment'] = function(url,opts){
  let {mesh,THREE} = opts

  let isFragmentShader = /\.(fs|frag|glsl)$/
  let isVertexShader   = /\.(vs|vert)$/

  let shaderReqs = []
  let shaderCode = {}
  let shader   = {
    fragment: { code: '', url: url.match( isFragmentShader ) ? url : '' },
    vertex:   { code: '', url: url.match( isVertexShader   ) ? url : '' }
  }
  
  var onShaderLoaded = ((args) => (type, status, code) => {
    shader[type].status = status 
    shader[type].code   = code 
    if( shader.fragment.code && shader.vertex.code ){
      
      let oldMaterial = mesh.material
      mesh.material = new THREE.RawShaderMaterial({
        uniforms: {
          time: { value: 1.0 },
          resolution: { value: new THREE.Vector2(1.0,1.0) }
        },
        // basic shaders include following common vars/funcs: https://github.com/mrdoob/three.js/blob/master/src/renderers/shaders/ShaderChunk/common.glsl.js
        fragmentShader: shader.fragment.status == 200 ? shader.fragment.code : THREE.ShaderChunk.meshbasic_frag,
        vertexShader:   shader.vertex.status   == 200 ? shader.vertex.code   : THREE.ShaderChunk.meshbasic_vert,

      });

      mesh.material.needsUpdate = true 
      mesh.needsUpdate          = true

      mesh.onBeforeRender = () => {
        if( !mesh.material || !mesh.material.uniforms ) return mesh.onBeforeRender = function(){}
        mesh.material.uniforms.time.value = xrf.clock.elapsedTime
      }

    }

  })({})

  // sidecar-load vertex shader file
  if( shader.fragment.url && !shader.vertex.url ){  
    shader.vertex.url = shader.fragment.url.replace(/\.fs$/,   '.vs')
                                           .replace(/\.frag$/, '.vert')
  }
   
  if( shader.fragment.url ){
    fetch(shader.fragment.url)
    .then( (res) => res.text().then( (code) => onShaderLoaded('fragment',res.status,code) ) )
  }

  if( shader.vertex.url ){
    fetch(shader.vertex.url)
    .then( (res) => res.text().then( (code) => onShaderLoaded('vertex',res.status,code) ) )
  }

}

xrf.frag.src.type['x-shader/x-vertex']   = xrf.frag.src.type['x-shader/x-fragment']

