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

    direction = direction || 1;
    damping = damping || .1;
    others.forEach(function (o) {

        if (p === o) return;
        var d = p.distance(o);
        var minDist = p.r;// + o.r;
        var vector = o.direction(p).multiplyScalar( .5 );
        if ( d < minDist) {

            //attraction or repulsion
            vector.multiplyScalar( direction );
            vector.multiplyScalar( damping );
            p.acc.add(vector);
            o.acc.sub(vector)

        }
    });

    return acc;
}

function draw(){
    requestAnimationFrame(draw);

    ctx.globalAlpha = 1;
    points.forEach(function( p ){
        p.acc.set( 0,0,0 );
    });

    var damping = .15;
    points.forEach(function( p ){

        p.prev.copy( p );

        p.r = p.repelRadius;
        attractRepel( p, p.others,  1, damping  );

        p.r = p.attractionRadius;
        attractRepel( p, p.friends, -1, damping );



    } );

    points.forEach(function( p ){

        p.add( p.acc );
        // p.multiplyScalar(.99);

        ctx.beginPath();
        ctx.strokeStyle = ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.random() * .2;

        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.prev.x, p.prev.y);
        p.friends.forEach(function( f ){

            if( p.distance( f ) > p.attractionRadius )return;
            for( var i = 0; i < 5; i++ ){

                var v = p.pointAt( Math.random(),f );
                ctx.moveTo(v.x, v.y);
                ctx.lineTo(v.x+1, v.y);

            }
        });
        ctx.stroke();

    });

    if( iteration++ > 300 )reset();

}


var points = [];
var iteration = 0;
function reset(){

    //palette:
    // http://www.color-hex.com/color-palette/49941
    var colors = [
        "#ffffff",
        "#ffffff",
        "#ffffff",
        "#dbbc8a",
        "#bd9f72",
        "#8b6a37",
        "#805d2c",
        "#714e0b",
        "#49300a",
        "#000000",
        "#000000",
        "#000000"
    ];

    var total = 250;
    var radius = h/4;
    iteration = 0;
    points = [];
    for ( var i = 0; i < total; i++ ){

        var p = Point.fromAngleDistance( i/total * PI2, radius * ( .75 + Math.random() * .25 ) );
        // var p = new Point( ( Math.random() - .5 ) * w, ( Math.random() - .5 ) * h );
        // var p = new Point( ( i/total) * w - w/2, Math.random() - .5 );
        p.color = colors[~~( Math.random() * colors.length )];

        p.friends = [];
        p.others = [];

        p.attractionRadius = 100;//radius * .25;
        p.repelRadius = 200;//radius * .75;

        p.r = 0;
        p.prev = new Point();
        p.acc = new Point();
        points.push( p );
    }

    //assigns friends
    points.forEach( function( p, myId ){

        var friendsIds = [];
        for( var i = 0; i <  total; i++ ){

            var id = i + ~~( ( Math.random() - .5 ) * total / 5 );
            id %= total;
            if( id < 0 )id += total;

            if( Math.random()> .5 ) id = ~~( Math.random() * total );
            if( id === myId )continue;

            //if the array doesn't contain the new friend's id
            if( friendsIds.indexOf( id ) === - 1 ){

                var o = points[ id ];
                if( Math.random() < .5 ){//} && o.distance(p) < p.attractionRadius ){
                    //store it
                    friendsIds.push( id );
                }
            }
        }

        p.friends = points.filter( function( p, i ){
            return friendsIds.indexOf( i ) !== -1;
        });

        p.others = points.filter( function( p, i ){
            return friendsIds.indexOf( i ) === -1;
        });

    })


}
canvas.addEventListener('mousedown', reset, false);

ctx.translate(w/2,h/2);

var G = new Graphics(ctx);
reset();
draw();