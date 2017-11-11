
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
    var ux = fx * fx * (3.0 - 2.0 * fx);
    var uy = fy * fy * (3.0 - 2.0 * fy);

    //interpolate the 4 noises with fractional parts
    return (a * (1-ux) + b * ux) + (c - a) * uy * (1.0 - ux) + (d - b) * ux * uy;

}
function reset(e) {

    var offset = w * .2;
    if( e != null ){
        offset = e.clientX;
    }
    ctx.clearRect(0,0,w,h);

    var cellSize = 2;
    var noiseScale = 0.05;
    var i, j, value;
    var points = [[],[],[],[]];
    for (j = 0; j < h; j += h/3) {

        var id = parseInt( j/(h/3));

        var values = [];
        for (i = 0; i <= w; i += cellSize ) {


            var x = ( i + offset ) / cellSize;
            var y = ( j ) / cellSize;

            switch( id ){
                case 0 :
                    value = Math.random();
                    break;

                case 1:
                    value = pseudoRandom( x, y ) * .5 + .5;
                    break;

                case 2:
                    value = noise( x * noiseScale, y * noiseScale ) * .5 + .5;
                    break;
            }

            values.push( [ i, j + value * h/3 ]);

        }
        points.push( values );

        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(w, j);
        ctx.stroke();

    }

    points.forEach( function( line ){
        renderLine( line );
    });


    ctx.strokeStyle = "#EEE";
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.moveTo(offset, 0);
    ctx.lineTo(offset, h);
    ctx.stroke();
    ctx.strokeStyle = "#F00";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(offset, 0);
    ctx.lineTo(offset, h);
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#000";

}


//creates a 2D context
var canvas, w, h, ctx;
canvas = document.createElement( 'canvas' );
document.body.appendChild( canvas );
w = canvas.width = window.innerWidth ;
h = canvas.height = window.innerHeight ;
ctx = canvas.getContext("2d");


window.addEventListener( 'mousedown', reset );
reset();

function renderLine(points) {
    ctx.beginPath();
    points.forEach(function( p ){
        ctx.lineTo(p[0],p[1]);
    });
    ctx.stroke();
}