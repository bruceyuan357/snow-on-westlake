// Animate the existing paintings; the original images remain the readable fallback.
function createLivingPaintings(scenes) {
  const canvas = document.getElementById('living-paintings');
  const root = document.documentElement;
  let gl;
  try {
    gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, powerPreference: 'low-power' });
  } catch { return null; }
  if (!gl) return null;
  let failed = false;
  let lastDraw = -100;
  let ready = false;
  let quality = 1;
  let slowFrames = 0;
  const textures = new Map();
  const uniforms = {};
  const shaders = [];
  let program;
  let buffer;
  const weather = scenes.map(scene => scene.element.dataset.weather.split(',').map(Number));
  const fire = scenes.map(scene => scene.element.dataset.fire.split(',').map(Number));
  const vertex = `
    attribute vec2 aPosition;
    varying vec2 vScreen;
    void main() {
      vScreen = vec2(aPosition.x * .5 + .5, .5 - aPosition.y * .5);
      gl_Position = vec4(aPosition, 0., 1.);
    }
  `;
  const fragment = `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    varying vec2 vScreen;
    uniform sampler2D uImageA, uImageB;
    uniform vec4 uCropA, uCropB;
    uniform vec3 uCameraA, uCameraB, uWeatherA, uWeatherB;
    uniform vec2 uFireA, uFireB, uSize;
    uniform float uTime, uBlend, uIndexA, uIndexB;

    float hash(vec2 p) {
      p = fract(mod(p, 127.) * vec2(123.34, 345.45));
      p += dot(p, p + 34.345);
      return fract(p.x * p.y);
    }
    float noise(vec2 p) {
      vec2 cell = floor(p), f = fract(p);
      f = f * f * (3. - 2. * f);
      return mix(mix(hash(cell), hash(cell + vec2(1.,0.)), f.x),
                 mix(hash(cell + vec2(0.,1.)), hash(cell + vec2(1.,1.)), f.x), f.y);
    }
    float cloud(vec2 p) {
      return noise(p) * .65 + noise(p * 2.13 + 7.2) * .35;
    }
    vec2 imageUV(vec4 crop, vec3 camera) {
      vec2 screen = (vScreen - .5 - camera.yz) / camera.x + .5;
      return (screen - crop.xy) / crop.zw;
    }
    float pollen(vec2 p, float density, float speed, float seed) {
      p.x *= uSize.x / uSize.y;
      p *= density;
      p += vec2(uTime * speed * .27, -uTime * speed) + seed;
      vec2 cell = floor(p), f = fract(p);
      vec2 center = .18 + .64 * vec2(hash(cell + seed), hash(cell + 91.7));
      center.x += sin(uTime * .5 + hash(cell) * 6.28) * .065;
      float radius = .014 + hash(cell + 31.2) * .019;
      float distance = length((f - center) * vec2(1., .78));
      return (1. - smoothstep(radius * .35, radius * 1.9, distance))
        * step(.76, hash(cell + 48.3)) * (.25 + hash(cell + 22.1) * .5);
    }
    float rainfall(vec2 p) {
      p.x = p.x * uSize.x / uSize.y + p.y * .19;
      p *= vec2(125., 5.);
      p.y -= uTime * 5.5;
      vec2 cell = floor(p), f = fract(p);
      float seed = hash(cell);
      float line = 1. - smoothstep(.005, .055, abs(f.x - (.15 + seed * .7)));
      float length = smoothstep(.08,.20,f.y) * (1. - smoothstep(.42,.94,f.y));
      return line * length * step(.48,seed);
    }
    vec3 painting(sampler2D image, vec4 crop, vec3 camera, vec3 climate, vec2 fire, float index, float direction) {
      vec2 uv = imageUV(crop, camera);
      float water = smoothstep(climate.x, climate.x + .14, uv.y);
      float ripple = sin(uv.y * 145. - uTime * .62) * .00052
                   + sin(uv.y * 267. + uTime * .37) * .00024;
      ripple *= 1. + max(0., climate.y) * 2.;
      float breath = (noise(vec2(uv.y * 38., uTime * .18)) - .5) * (.00034 + max(0.,-climate.y) * .001);
      // Strong autumn wind subtly moves the upper painting; prose stays steady.
      float wind = max(0., -climate.y - .23) * 8.;
      breath += sin(uTime * .95 + uv.y * 9.) * wind * .001 * (1. - smoothstep(.35,.95,uv.y));
      float passing = sin(uBlend * 3.141593);
      vec2 drift = vec2(cloud(vScreen * vec2(3., 9.) + vec2(uTime * .02, 0.)) - .5,
                        sin(vScreen.x * 7. + uTime * .15) * .2);
      vec2 moving = uv + vec2(breath + ripple * water, 0.) + drift * passing * .009 * direction;
      vec3 color = texture2D(image, clamp(moving, .001, .999)).rgb;
      vec2 ember = (uv - fire) / vec2(.046, .065);
      float pulse = .55 + sin(uTime * 2.7) * .18 + sin(uTime * 6.3 + 1.1) * .10;
      color += vec3(1., .39, .07) * exp(-dot(ember, ember) * 1.4) * climate.z * pulse;
      if (climate.y > 0.) color = mix(color, vec3(.68,.72,.70), rainfall(vScreen) * climate.y * .21);
      if (climate.y < 0.) {
        float dust = pollen(vScreen, 11., .06, 3.1) + pollen(vScreen, 23., .04, 16.4) * .35;
        color = mix(color, vec3(.91,.85,.63), clamp(dust * -climate.y, 0., .16));
      }
      return color;
    }
    void main() {
      vec3 color = painting(uImageA, uCropA, uCameraA, uWeatherA, uFireA, uIndexA, 1.);
      if (uBlend > .0001) {
        vec3 next = painting(uImageB, uCropB, uCameraB, uWeatherB, uFireB, uIndexB, -1.);
        // The dissolve follows long, fine bands of mist instead of a flat fade.
        float grain = cloud(vScreen * vec2(2.5, 23.) + vec2(uTime * .01, 0.));
        float threshold = .37 + grain * .26;
        float dissolve = smoothstep(threshold - .24, threshold + .24, uBlend);
        color = mix(color, next, dissolve);
      }
      color += (hash(floor(vScreen * uSize) + mod(floor(uTime * 8.), 97.)) - .5) * .002;
      gl_FragColor = vec4(color, 1.);
    }
  `;
  function disable() {
    if (failed) return;
    failed = true;
    root.classList.remove('has-living-paintings');
    for (const texture of textures.values()) gl.deleteTexture(texture);
    if (buffer) gl.deleteBuffer(buffer);
    if (program) gl.deleteProgram(program);
    shaders.forEach(shader => gl.deleteShader(shader));
  }
  canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); disable(); });
  try {
    program = gl.createProgram();
    for (const [type, source] of [[gl.VERTEX_SHADER, vertex], [gl.FRAGMENT_SHADER, fragment]]) {
      const shader = gl.createShader(type);
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('Painting shader unavailable');
      gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Painting program unavailable');
    gl.useProgram(program);
    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    for (const name of ['ImageA','ImageB','CropA','CropB','CameraA','CameraB','WeatherA','WeatherB','FireA','FireB','Size','Time','Blend','IndexA','IndexB']) {
      uniforms[name] = gl.getUniformLocation(program, 'u' + name);
    }
    gl.uniform1i(uniforms.ImageA, 0);
    gl.uniform1i(uniforms.ImageB, 1);
  } catch { disable(); return null; }

  function resize() {
    if (failed) return;
    const ratio = Math.min(devicePixelRatio || 1, 1.5, Math.sqrt(1800000 / (innerWidth * innerHeight))) * quality;
    canvas.width = Math.round(innerWidth * ratio);
    canvas.height = Math.round(innerHeight * ratio);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uniforms.Size, canvas.width, canvas.height);
    lastDraw = -100;
  }
  function textureFor(scene) {
    if (textures.has(scene.index)) return textures.get(scene.index);
    if (!scene.photo.complete || !scene.photo.naturalWidth) return null;
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, scene.photo);
    textures.set(scene.index, texture);
    return texture;
  }
  function bind(scene, suffix, slot, texture) {
    gl.activeTexture(gl.TEXTURE0 + slot);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    const crop = scene.crop;
    gl.uniform4f(uniforms['Crop' + suffix], crop.x, crop.y, crop.width, crop.height);
    gl.uniform3f(uniforms['Camera' + suffix], scene.pose.scale, scene.pose.x / scene.width, scene.pose.y / scene.height);
    gl.uniform3fv(uniforms['Weather' + suffix], weather[scene.index]);
    gl.uniform2fv(uniforms['Fire' + suffix], fire[scene.index]);
    gl.uniform1f(uniforms['Index' + suffix], scene.index);
  }
  return {
    get healthy() { return !failed; },
    resize,
    draw(index, blend, time, force = false) {
      if (failed || (!force && time - lastDraw < 32)) return;
      if (ready && !force) {
        slowFrames = time - lastDraw > 75 ? slowFrames + 1 : Math.max(0, slowFrames - 1);
        if (slowFrames >= 10 && quality > .65) {
          quality = Math.max(.65, quality * .82);
          slowFrames = 0;
          resize();
        }
      }
      const a = scenes[index], b = scenes[Math.min(index + 1, scenes.length - 1)];
      try {
        const textureA = textureFor(a), textureB = textureFor(b);
        if (!textureA || !a.crop) return;
        if (blend > 0 && (!textureB || !b.crop)) {
          root.classList.remove('has-living-paintings');
          return;
        }
        bind(a, 'A', 0, textureA);
        bind(textureB && b.crop ? b : a, 'B', 1, textureB || textureA);
        gl.uniform1f(uniforms.Time, time / 1000);
        gl.uniform1f(uniforms.Blend, blend);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        // Keep GPU memory bounded as longer works pass through their paintings.
        for (const [key, texture] of textures) {
          if (textures.size <= 4) break;
          if (key !== a.index && key !== b.index) { gl.deleteTexture(texture); textures.delete(key); }
        }
        if (!ready && gl.getError() !== gl.NO_ERROR) { disable(); return; }
        ready = true;
        lastDraw = time;
        root.classList.add('has-living-paintings');
      } catch { disable(); }
    }
  };
}
