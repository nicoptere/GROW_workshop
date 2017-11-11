

function pseudoRandom(x, y) {
    return ( ( Math.sin( Math.pow( x + 12.9898, 2 ) + Math.pow( y + 78.233, 2 ) ) ) * 43758.5453123 ) % 1;
}


function noise(x, y) {

    //gets the integer part
    var ix = parseInt(x);
    var iy = parseInt(y);

    // 2D cell corners
    var a = pseudoRandom(ix,iy);
    var b = pseudoRandom(ix+1, iy);
    var c = pseudoRandom(ix, iy+1);
    var d = pseudoRandom(ix+1, iy+1);

    //gets the fractional part
    var fx = (x % 1);
    var fy = (y % 1);

    //gets the U/V ratios inside the cell
    var ux = fx * fx * (3.0 - 2.0 * fx);
    var uy = fy * fy * (3.0 - 2.0 * fy);

    //interpolate the 4 noises with fractional parts
    return (a * (1-ux) + b * ux) + (c - a) * uy * (1.0 - ux) + (d - b) * ux * uy;

}
//returns a normalized value [ 0->1 ]
function getValue( x, y ){

    // //return a pseudo random value
    // return pseudoRandom( x,y );

    // //downscales the pseudo random function input gives bigger blocks
    var scale = 100;
    var value = pseudoRandom( ~~( x / scale ), ~~( y / scale ) );
    // return value;
    //
    // //accumulation
    // scale = 2;
    // value += pseudoRandom( ~~( x / scale ), ~~( y / scale ) );
    // return value / 2;
    //
    // //resampling
    // scale = 10;
    // value += pseudoRandom( ~~( x / scale ), ~~( y / scale ) );
    // return value / 3;
    //
    // scale = 20;
    // value += pseudoRandom( ~~( x / scale ), ~~( y / scale ) );
    // return value / 4;


    //Fractional Brownian Motion

    //iterations count
    var OCTAVES = 6;
    //contribution factor
    var amplitude = 1;
    //scale factor
    scale = 100;

    value = 0;
    for (var i = 0; i < OCTAVES; i++) {
        value += amplitude * noise( x / scale, y / scale );
        x *= 2;
        y *= 2;
        amplitude *= .5;
    }
    return value;

    // return Easing.outExpo(value);

    // return 1 - Math.abs( value / OCTAVES ) / Easing.inOutSine(value);


}

function draw() {
    
    var imgData = ctx.getImageData(0, 0, size, size);
    var i = imgData.data.length;

    var time = Date.now() % 1000;
    while (i -= 4) {

        //x / y from flat array given the picture width
        var x = (i/4) % size;
        var y = ~~( (i/4) / size );

        //gets a random value
        var value = parseInt( getValue( time + x, time + y ) * 0xFF );

        imgData.data[i]         = value;
        imgData.data[i + 1]     = value;
        imgData.data[i + 2]     = value;
        imgData.data[i + 3]     = 0xFF;
        
    }
    ctx.putImageData(imgData, 0, 0);
    return ctx;
}


var size = 256;

var canvas = document.createElement( 'canvas' );
canvas.width  = canvas.height = size;
canvas.style.width  = canvas.style.height = 3 * size + "px";
var ctx = canvas.getContext( "2d" );
document.body.appendChild( canvas );

window.addEventListener('mousedown', draw );
draw();