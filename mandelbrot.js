var canvas, ctx, ihex = [], ihash = {};
var MAX_ITERATIONS = 50;
function init() {
    canvas = document.getElementById('thing');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    cacheHexColors();

    ctx = canvas.getContext('2d');
    var image = ctx.createImageData(canvas.width, canvas.height);
    var scale = Math.min(canvas.width, canvas.height);

    console.time("MANDELBROT");
    for (var y = 0; y < canvas.height; y++) {
        for (var x = 0; x < canvas.width; x++) {
            mandelbrot(x, y, x / scale, y / scale, image);
        }
    }
    // render pixels
    ctx.putImageData(image, 0, 0);
    console.timeEnd("MANDELBROT");
}

function mandelbrot(x, y, c1, c2, image) {
    var x2, y2;
    var a = 2 * c1 - 1.5;
    var b = 2 * c2 - 1;
    var hex = [0, 0, 0];

    x2 = y2 = 0;

    for (var i = 0; i < MAX_ITERATIONS; i++) {
        var xTemp = x2 * x2 - y2 * y2 + a;
        var yTemp = 2 * x2 * y2 + b;
        x2 = xTemp;
        y2 = yTemp;
        var absz = x2 * x2 + y2 * y2;
        if (absz > 4) {
            hex = itorgb(i, absz);
	    break;
        }
    }
    image.data[(x + y * canvas.width) * 4] = hex[0];
    image.data[(x + y * canvas.width) * 4 + 1] = hex[1];
    image.data[(x + y * canvas.width) * 4 + 2] = hex[2];
    image.data[(x + y * canvas.width) * 4 + 3] = 255;
}

function itorgb (i, absz) {
    var h = i + Math.log(Math.log(4)) / Math.log(2) - Math.log(Math.log(absz)) / Math.log(2);
    h = h / MAX_ITERATIONS * 360;
    var hprime = h / 60;
    var x = 1 - Math.abs(hprime % 2 - 1);
    var r = 0;
    var g = 0;
    var b = 0;

    if (0 <= hprime && hprime < 1) {
	r = 1;
	g = x;
	b = 0;
    }

    else if (1 <= hprime && hprime < 2) {
	r = x;
	g = 1;
	b = 0;
    }

    else if (2 <= hprime && hprime < 3) {
	r = 0;
	g = 1;
	b = x;
    }

    else if (3 <= hprime && hprime < 4) {
	r = 0;
	g = x;
	b = 1;
    }

    else if (4 <= hprime && hprime < 5) {
	r = x;
	g = 0;
	b = 1;
    }

    else if (5 <= hprime && hprime < 6) {
	r = 1;
	g = 0;
	b = x;
    }

    r = Math.floor(r * 255);
    g = Math.floor(g * 255);
    b = Math.floor(b * 255);

    return [r, g, b];
}

function cacheHexColors() {
    for (var i = 0; i < MAX_ITERATIONS; i++) {
        ihex.push(itorgb(i));
    }
}
