function draw(){

    requestAnimationFrame(draw);
    var damping = .01;
    var times = 10;
    while( times-- ){

        var tmp = [];
        points.forEach(function( p ){

            p.prev.copy( p );

            p.x += ( p.next.x - p.x ) * damping;
            p.y += ( p.next.y - p.y ) * damping;

            ctx.strokeStyle = ctx.fillStyle = p.color;

            if( p.distance( p.next ) > 5 ){

                // ctx.globalAlpha = p.alpha;
                ctx.beginPath();

                for( var i = 0; i < 15; i++ ){

                    var v = p.pointAt( Math.random(), p.next );
                    ctx.moveTo(v.x, v.y);
                    ctx.lineTo(v.x+1, v.y);

                }
                ctx.stroke();
                tmp.push( p );

            }else{

                ctx.globalAlpha = 1;
                G.disc( p, 2 );

            }

        });

        points = tmp;
        points.forEach( function( p, i ){
            p.next  = points[ ( i + 1 ) % points.length ];
        });
    }


}


var points = [];
var iteration = 0;
function reset(){

    ctx.restore();
    ctx.clearRect( 0,0,w,h );
    ctx.save();
    ctx.translate(w/2,h/2);

    iteration = 0;
    var total = 100;
    var radius = h/3;
    points = [];
    for ( var i = 0; i < total; i++ ){

        var p = Point.fromAngleDistance( i/total * PI2, radius * ( 1 + Math.random() - .5 ) );
        var p = new Point( ( Math.random() - .5 ) * h * 2, ( Math.random() - .5 ) * h * 2  );
        // var p = new Point( ( i/total) * w - w/2, ( Math.random() - .5 ) * h );
        var v = ~~( Math.random() * 0xFF );
        p.color = "rgb("+v+","+v+","+v+")";
        p.next = null;
        p.prev = new Point();
        points.push( p );
    }

    //assigns target
    points.forEach( function( p, i ){
        p.next  = points[ ( i + 1 ) % points.length ];
    });
    draw();

}
canvas.addEventListener('mousedown', reset, false);
ctx.save();
var G = new Graphics(ctx);
reset();
draw();