

//
// // Based on Morgan McGuire @morgan3d
// // https://www.shadertoy.com/view/4dS3Wd
//
function pseudoRandom(x, y) {
    return ( ( Math.sin( Math.pow( x * 12.9898, 2 ) + Math.pow( y * 78.233, 2 ) ) ) * 43758.5453123 ) % 1;
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

    //return a not-random value
    return ( x / y );

    //return a random value
    return Math.random();

    //return a pseudo random value
    return pseudoRandom( x,y );

    //downscales the pseudo random function input gives bigger blocks
    var scale = 100;
    return pseudoRandom( ~~( x / scale ), ~~( y / scale ) );

    //accumulates pseudo random values sampled and different scales
    var octaves = 6;
    var accumulator = 0;
    scale = 1;
    for( var i = 0; i < octaves; i++ ){

        //upsclaing to sample blurier and blurier noise
        scale *= 2;

        //pseudo random values accumulated linearly
        accumulator += noise( x / scale, y / scale );

        //pseudo random values accumulated non-linearly using an easing function
        // var value = noise( x / scale, y / scale );
        // value = Easing.inOutExpo( value );
        // accumulator += value;

    }
    accumulator /= octaves;
    return accumulator;


}

function turbulence() {
    
    var imgData = ctx.getImageData(0, 0, size, size);
    var i = imgData.data.length;
    while (i -= 4) {

        //x / y from flat array given the size
        var x = (i/4) % size;
        var y = ~~( (i/4) / size );

        //gets a random value
        var value = parseInt( getValue( x, y ) * 0xFF );

        imgData.data[i]         = value;
        imgData.data[i + 1]     = value;
        imgData.data[i + 2]     = value;
        imgData.data[i + 3]     = 0xFF;
        
    }
    ctx.putImageData(imgData, 0, 0);
    return ctx;
}


var size = 512;

var canvas = document.createElement( 'canvas' );
canvas.width  = size;
canvas.height = size;
var ctx = canvas.getContext( "2d" );
document.body.appendChild( canvas );

window.addEventListener('mousedown', turbulence );
turbulence();