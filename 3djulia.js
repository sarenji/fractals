var canvas, gl, prog, size;
function init() {
    canvas = document.getElementById('thing');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    gl.viewport(0, 0, canvas.width, canvas.height);
    size = Math.min(canvas.width, canvas.height);

    prog = gl.createProgram();
    gl.attachShader(prog, getShader(gl, 'vertex'));
    gl.attachShader(prog, getShader(gl, 'fragment'));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    var posAtrLoc = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(posAtrLoc); // what does this do again?
    var posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    var vertices = new Float32Array([
        -1,-1,1.,   1, -1, 1.,   1, 1, 1.,   -1, 1, 1.]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(posAtrLoc, 3, gl.FLOAT, false, 0, 0); // wut?
    gl.uniform4f(gl.getUniformLocation(prog, "scale"), size/2, size/3, size/2, size/3);
    gl.uniform3f(gl.getUniformLocation(prog, "rO"), 0, 0, 1.95);
    gl.uniform1f(gl.getUniformLocation(prog, "epsilon"), 0.006);
    gl.uniform1i(gl.getUniformLocation(prog, "maxIterations"), 8);
    gl.uniform3f(gl.getUniformLocation(prog, "light"), -10, -10, -10);
    gl.uniform4f(gl.getUniformLocation(prog, "backgroundColor"), .2, .2, .2, 1);
    gl.uniform4f(gl.getUniformLocation(prog, "mu"), -1, 0.4, 0, 0);
    gl.uniform1i(gl.getUniformLocation(prog, "renderShadows"), 0);
    anim();
}

function anim() {
    var t = (+new Date) / 1000;
    gl.uniform4f(gl.getUniformLocation(prog, "mu"),
        Math.cos(t), 0.4,
        0, 0);
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
