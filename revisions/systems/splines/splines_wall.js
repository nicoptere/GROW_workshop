var G = new Graphics(ctx);

var origins = [];
var destinations = [];
function reset(){

    ctx .fillStyle = "#FFF";
    ctx.globalAlpha = 1;
    ctx.fillRect( 0,0,w,h );
    ctx.fillStyle = "#000";

    origins = [];
    destinations = [];
    var step = 200;
    for( var i = -step; i <= w + step; i+=step ){
        origins.push( new Point( i, h/2 + ( Math.random() - .5 ) * h/2 ) );
        destinations.push( new Point( i + ( Math.random()-.5 ) * step, h/2 + ( Math.random() - .5 ) * h/2 ) );
    }

    draw()
}
function draw(){

    //computes 2 curves:

    var precision = .01;
    var c0 = cardinal.compute( origins,         precision, 1, false );
    var c1 = cardinal.compute( destinations,    precision, 2, false );

        // var c0 = quadratic.compute( origins,         precision, false );
        // var c1 = quadratic.compute( destinations,    precision, false );

        // var c0 = catmullrom.compute( origins,         precision, false );
        // var c1 = catmullrom.compute( destinations,    precision, false );

    ctx.lineJoin = "round";
    ctx.lineWidth = 5;

    // interpolates between the 2

    for( var t = 0; t < 1; t += .005 ){

        ctx.globalAlpha = Shaping.square( t * 4.5 ) * .25;

        var curve = [];
        for( var i = 0; i < c0.length; i++ ){

            var p0 = c0[i];
            var p1 = c1[i];

            //gets a point at T between P0 & P1
            curve.push( p0.pointAt( t, p1 ) )

        }
        G.polyline( curve );

    }

}
canvas.addEventListener('mousedown', reset );
reset();

