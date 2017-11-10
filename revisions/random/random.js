
function reset() {

    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = "#000";

    var i, x, y;
    var count = 10000;

    var time = Date.now();
    for ( i = 0; i < count; i++) {

        //normalize the i
        var t = i / count;

        //linear X value
        x = i / count * w;

        //start with a regular sinusoid
        var r = Math.sin( t * Math.PI * 2 );

        //now to get a seemingly random value
        //augment the frequency.

            // r = Math.sin( t * time );

        //some nice patterns emerge but they're very regular
        //we can shake it further by using the result as the seed for another sinusoid

            // r = Math.sin(Math.sin(t * time) * time);

        //better already but the values seem to 'stick' to the boundaries
        //we'd rather have uniformly distributed values

            // r = Math.abs(Math.sin(Math.sin(t * time) * time));
            // r = ( Math.sqrt(1 - r) * 2 - 1 );

        //plots it nicely centered
        y = h / 2 + r * h / 3;
        disc(x, y, 2);
    }

    return;
    //actual results from a Math.random() (ground truth)
    ctx.fillStyle = "#F00";
    for ( i = 0; i < count; i++) {
        x = i / count * w;
        y = h/2 + ( Math.random() * 2 - 1 ) * h / 3;
        disc( x, y, 2 );
    }

}

//creates a 2D context
var canvas, w, h, ctx;
canvas = document.createElement( 'canvas' );
document.body.appendChild( canvas );
w = canvas.width = window.innerWidth ;
h = canvas.height = window.innerHeight ;
ctx = canvas.getContext("2d");
var seed = 0;
reset();

canvas.addEventListener( 'mousedown', reset );

function disc( x,y,r ){
    ctx.beginPath();
    ctx.arc( x, y, r, 0, Math.PI * 2 );
    ctx.fill();
}