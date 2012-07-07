var canvas, gl, prog, size, cLoc, scaleLoc, startTime, amp;
function init() {
    canvas = document.getElementById('thing');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    amp = Math.min(canvas.width, canvas.height) / 2;
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    gl.viewport(0, 0, canvas.width, canvas.height);
    size = Math.min(canvas.width, canvas.height);

    prog = gl.createProgram();
    gl.attachShader(prog, getShader(gl, 'vertex'));
    gl.attachShader(prog, getShader(gl, 'fragment'));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    var posAtrLoc = gl.getAttribLocation(prog, "vPos");
    gl.enableVertexAttribArray(posAtrLoc); // what does this do again?
    var posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    var vertices = new Float32Array([
        -1,-1,0, 1, -1, 0, 1, 1, 0, -1, 1, 0]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(posAtrLoc, 3, gl.FLOAT, false, 0, 0); // wut?
    scaleLoc = gl.getUniformLocation(prog, "scale");
    gl.uniform2f(scaleLoc, size/2, size/3);
    startTime = +new Date;
    anim();
}

// TODO: Find pretty algorithm for animating `c`.
zoom = 1;
function anim() {
    var t = (+new Date);
    var d = t - startTime;
    gl.uniform1f(scaleLoc, 500 * zoom);
    gl.uniform2f(gl.getUniformLocation(prog, "offset"), canvas.width / 2, canvas.height / 2);
    gl.uniform1f(gl.getUniformLocation(prog, "t"), d / 1000);
    zoom *= 1.02;
    draw();
    requestAnimFrame(anim);
}

function draw() {
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.flush();
}

function getShader(gl, id) {
    var shaderElement = document.getElementById(id);
    var shaderScript = shaderElement.innerHTML;
    var shader;
    if (shaderElement.type == "x-shader/x-fragment")
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    else if (shaderElement.type == "x-shader/x-vertex")
        shader = gl.createShader(gl.VERTEX_SHADER);
    else
        return null;
    gl.shaderSource(shader, shaderScript);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS) == 0)
        alert(gl.getShaderInfoLog(shader));
    return shader;
}

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();
