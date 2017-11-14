/**
 * Created by nico on 23/11/13.
 */
var CatmullRom = function(exports)
{

    exports.compute = function( points, precision, loop )
    {

        precision = Math.max( .01, Math.min( 1, precision ||.1 ) );
        loop = loop || false;

        var i = 0,
            t = 0,
            p0,
            p1,
            p2,
            p3;

        var tmp = [];

        for (i = 0; i < points.length - ( loop ? 0 : 1 ); i++)
        {
            p0 = points [(i -1 + points.length) % points.length];
            p1 = points [i];
            p2 = points [(i +1 + points.length) % points.length];
            p3 = points [(i +2 + points.length) % points.length];
            tmp.push( p1 );

            for ( t = 0; t < 1; t+= precision )
            {
                tmp.push( new Point(	0.5 * ((          2*p1.x) +
                                        t * (( -p0.x           +p2.x) +
                                        t * ((2*p0.x -5*p1.x +4*p2.x -p3.x) +
                                        t * (  -p0.x +3 * p1.x -3 * p2.x +p3.x)))),
    
                                        0.5 * ((          2*p1.y) +
                                        t * (( -p0.y           +p2.y) +
                                        t * ((2*p0.y -5*p1.y +4*p2.y -p3.y) +
                                        t * (  -p0.y +3 * p1.y -3 * p2.y +p3.y))))		) );
            }
        }
        if( loop && points.length > 0 )tmp.push( points[ 0 ]);
        return tmp;

    };

    return exports;
    
}({});