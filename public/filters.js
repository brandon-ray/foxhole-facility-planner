const shadowFilter = {
    vert: `
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void) {
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}
`,
    frag: `
varying vec2 vTextureCoord;
    
uniform sampler2D uSampler;
uniform vec4 inputSize;
uniform vec4 outputFrame;
uniform vec2 shadowDirection;

vec4 blur(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(1.3846153846) * direction;
  vec2 off2 = vec2(3.2307692308) * direction;
  vec2 off3 = vec2(5.2307692308) * direction;
  color += texture2D(image, uv) * 0.2270270270;
  color += texture2D(image, uv + (off1 / resolution)) * 0.3;
  color += texture2D(image, uv - (off1 / resolution)) * 0.3;
  color += texture2D(image, uv + (off2 / resolution)) * 0.3;
  color += texture2D(image, uv - (off2 / resolution)) * 0.3;
  color += texture2D(image, uv + (off3 / resolution)) * 0.3;
  return color;
}

void main(void) {
    vec2 bodyFilterCoord = vTextureCoord - shadowDirection * inputSize.zw;

    vec4 originalColor = texture2D(uSampler, vTextureCoord);
    
    // normal blend mode coefficients (1, 1-src_alpha)
    // shadow is destination (backdrop), original is source
    vec4 shadowColor = blur(uSampler, bodyFilterCoord, vec2(2.0, 2.0), vec2(-2.0, -2.0)* inputSize.zw);
    shadowColor.rgb = vec3(0.0);
    shadowColor.a *= 0.5;
    gl_FragColor = originalColor + shadowColor * (1.0 - originalColor.a);
    //gl_FragColor =  shadowColor;
}
`
};