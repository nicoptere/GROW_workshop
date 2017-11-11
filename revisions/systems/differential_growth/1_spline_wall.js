
var G = new Graphics(ctx);
ctx .fillStyle = "#FFF";
w = ctx.width =
h = ctx.height = 1200;
ctx.fillRect( 0,0,w,h );
ctx.fillStyle = "#000";
var p0 = new Point( w/2 ,       h/2+30 );
var p1 = new Point( w/2 -30 ,   h/2-30 );
var p2 = new Point( w/2 +30 ,   h/2-30 );

var poly = [p0, p1, p2];

//adds a radius to all points
var radius = 30;
poly.forEach(function(p){
    p.r = radius;
    p.acc = new Point();
});

G.polyline( poly, true );


function update(){

    ctx.clearRect(0,0,w,h);
    // ctx.globalAlpha = .1;

    while( poly.length > 1000 ){
        var tmp = [];
        for( var i = 0; i < poly.length; i++ ){

            var current = poly[ i ];


            var next = poly[ ( i + 1 ) % poly.length ];

            tmp.push( current );

            if( current.distance( next ) > radius ){
                var midpoint = current.midpoint( next );
                midpoint.r = radius;
                midpoint.acc = new Point();
                tmp.push( midpoint );
            }

        }
        poly = tmp;

        attractRepel( poly, poly );

        G.polygon( poly, true );
    // poly.forEach(function (p) {disc(p.x, p.y, 2);});

        // save( ctx, 'differential_growth');
        return;
    }

    requestAnimationFrame(update);



}
update();

function attractRepel(a, b ) {

    var acc = 0;
    a.forEach(function (p){
        p.acc.set(0,0,0);
    } );

    a.forEach(function (p) {

        b.forEach(function (o) {

            if (p === o) return;


            var d = p.distance(o);
            var minDist = p.r + o.r;

            var dir = p.direction(o).multiplyScalar(  .15 );
            dir.z = 0;
            if (d < minDist) {
                p.acc.sub(dir);
                o.acc.add(dir);
            }
        });

    });
    a.forEach(function (p){p.add( p.acc );} );
    return acc;
}
function disc( x,y,r ){
    ctx.beginPath();
    ctx.arc( x, y, r, 0, Math.PI * 2 );
    ctx.fill();
}
