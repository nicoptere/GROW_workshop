/**
 *
 * @param p needs a 'r' radius parameter
 * @param others other points need a 'r' radius  parameter
 * @param direction determines if we attract or repel the other points
 * @param damping how much force is applied
 * @returns {Point} force totale à appliquer sur le point
 */

function attractRepel( p, others, direction, damping ) {

    direction = direction || 1;

    damping = damping || .1;

    others.forEach(function (o) {

        if (p === o) return;

        var d = p.distance(o);
        var minDist = p.r + o.r;
        var vector = p.direction(o).multiplyScalar( .5 );
        if ( d < minDist) {

            //attraction or repulsion
            vector.multiplyScalar( direction );
            vector.multiplyScalar( damping );
            p.acc.add(vector);
            o.acc.sub(vector)

        }
    });
}

function draw(){

    requestAnimationFrame(draw);
    ctx.clearRect(0,0,w,h);

    ctx.globalAlpha = 1;
    points.forEach(function( p ){
        p.acc.set( 0,0,0 );
    });

    var t = Math.sin( Date.now() * 0.001 ) * .5 + .5;
    var damping = .15;
    points.forEach(function( p ){

        p.r = 10 + t * 50;
        attractRepel( p, points,  1, damping );
        attractRepel( p, points, -1, damping *  10 );

    } );
    points.forEach(function( p ){

        p.add( p.acc );

        ctx.globalAlpha = 1;
        G.disc( p, 2 );

        ctx.globalAlpha = .2;
        G.disc( p, p.r );

    });

}

var points = [];
function reset(){

    var total = 300;
    points = [];
    for ( var i = 0; i < total; i++ ){

        var p = new Point( Math.random() * w, Math.random() * h );
        p.r = 10;
        p.acc = new Point();
        points.push( p );
    }
}
canvas.addEventListener('mousedown', reset, false);

var G = new Graphics(ctx);
reset();
draw();
draw();