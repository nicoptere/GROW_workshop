/**
 * Created by nico on 23/11/13.
 */

var Cardinal = function( exports )
{


    exports.compute = function( points, precision, tension, loop )
    {

        precision = Math.max( .01, Math.min( 1, precision ||.1 ) );
        tension = Math.max( -5, Math.min( 5, tension || 1 ) );
        loop = Boolean( loop );



        var tmp = [],
            p0,
            p1,
            p2,
            p3,
            i = 0,
            t = 0;

        for (i = 0; i < points.length - ( loop ? 0 : 1 ); i++)
        {

            p0 = (i < 1) ? points [points.length - 1] : points [i - 1];
            p1 = points [i];
            p2 = points [(i +1 + points.length) % points.length];
            p3 = points [(i +2 + points.length) % points.length];

            for ( t= 0; t < 1; t += precision )
            {

                tmp.push(  new Point(
                                            // x
                                            tension * ( -t * t * t + 2 * t * t - t) * p0.x +
                                            tension * ( -t * t * t + t * t) * p1.x +
                                            (2 * t * t * t - 3 * t * t + 1) * p1.x +
                                            tension * (t * t * t - 2 * t * t + t) * p2.x +
                                            ( -2 * t * t * t + 3 * t * t) * p2.x +
                                            tension * (t * t * t - t * t) * p3.x,

                                            // y
                                            tension * ( -t * t * t + 2 * t * t - t) * p0.y +
                                            tension * ( -t * t * t + t * t) * p1.y +
                                            (2 * t * t * t - 3 * t * t + 1) * p1.y +
                                            tension * (t * t * t - 2 * t * t + t) * p2.y +
                                            ( -2 * t * t * t + 3 * t * t) * p2.y +
                                            tension * (t * t * t - t * t) * p3.y

                                        ) );
            }
        }
        if( loop && points.length > 0 )tmp.push( points[ 0 ]);
        return tmp;
    };
    return exports;
}({});