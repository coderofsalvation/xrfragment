precision mediump float;
precision mediump int;

uniform float time;

varying vec3 vPosition;
varying vec4 vColor;

void main()	{

  vec4 color = vec4( vColor );
  color.r += sin( vPosition.x * 10.0 + time ) * 0.5;
  color.g = 0.0;
  color.b += cos( vPosition.x * 10.0 + time ) * 0.5;

  gl_FragColor = color;

}
