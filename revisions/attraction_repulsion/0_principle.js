/**
 *
 * @param p needs a 'r' radius parameter
 * @param others other points need a 'r' radius  parameter
 * @param direction determines if we attract or repel the other points
 * @param damping how much force is applied
 * @returns {Point} force totale à appliquer sur le point
 */

function attractRepel( p, others, direction, damping ) {

    var acc = new Point();

    others.forEach(function (o) {

        if (p === o) return;
        var d = p.distance(o);
        var minDist = p.r + o.r;
        var vector = p.direction(o).multiplyScalar( .5 );
        if (d < minDist) {

            //attraction or repulsion vector
            vector.multiplyScalar( direction );
            vector.multiplyScalar( damping );

            acc.add(vector);

            o.sub(vector)
        }
    });

    damping = damping || .1;

    acc.multiplyScalar( damping );

    return acc;
}


function draw(){
    requestAnimationFrame(draw);
    ctx.clearRect(0,0,w,h);

    ctx.globalAlpha = .2;
    G.circle( mouse, mouse.r );

    ctx.globalAlpha = .2;
    points.forEach(function( p ){
        G.disc( p, p.r );
        G.disc( p, 2 );
    });

    attractRepel( mouse, points, direction, 5 );

    return;

    points.forEach(function( p ){

        attractRepel( p, points, direction, 2.5 );

    } );


}

var mouse = new Point(w/2, h/2);
//repel radius
mouse.r = 150;
function updateMouse( e ){
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}
canvas.addEventListener('mousemove', updateMouse, false);
var direction = -1;
function changeDirection(){
    direction *= -1;
}
canvas.addEventListener('mousedown', changeDirection, false);

var points = [];
for( var i = 0; i < 250; i++ ){
    var p = new Point( Math.random() * w, Math.random() * h );
    //repel radius
    p.r = 25;
    points.push( p );
}

var G = new Graphics(ctx);
draw();