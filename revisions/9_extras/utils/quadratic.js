var quadratic = function(exports)
{
    
    
    
    exports.compute = function( anchors, precision, loop )
    {

        var i, t;

        exports.anchors = anchors;

        precision =  Math.max( .01, Math.min( 1, precision ) );

        exports.loop = Boolean( loop );
        exports.vertices = [];
        for ( i = 0; i < anchors.length; i++ )
        {

            for ( t = 0; t < 1; t+= precision )
            {

                exports.vertices.push( exports.computePointAt( i, t ) );

            }

        }
        return exports.vertices;

    };

    exports.computePointAt = function( i, t )
    {

        var p0 = exports.p0 || ( exports.p0 = new Point() ),
            p1 = exports.anchors[ i ],
            p2 = exports.p2 || ( exports.p2 = new Point() );

        if( i == 0 )
        {

            if ( exports.loop == true )
            {

                p0.x = ( exports.anchors[ exports.anchors.length-1 ].x + exports.anchors[ i ].x ) / 2;
                p0.y = ( exports.anchors[ exports.anchors.length-1 ].y + exports.anchors[ i ].y ) / 2;
                p0.z = ( exports.anchors[ exports.anchors.length-1 ].z + exports.anchors[ i ].z ) / 2;

            }else{

                p0 = exports.anchors[ i ];
            }

        }
        else
        {

            p0.x = ( exports.anchors[ i - 1 ].x + exports.anchors[ i ].x ) / 2;
            p0.y = ( exports.anchors[ i - 1 ].y + exports.anchors[ i ].y ) / 2;
            p0.z = ( exports.anchors[ i - 1 ].z + exports.anchors[ i ].z ) / 2;

        }


        if( i == exports.anchors.length - 1 )
        {

            if (exports.loop == true)
            {

                p2.x=( exports.anchors[ i ].x + exports.anchors[0].x ) / 2;
                p2.y=( exports.anchors[ i ].y + exports.anchors[0].y ) / 2;
                p2.z=( exports.anchors[ i ].z + exports.anchors[0].z ) / 2;

            }
            else
            {

                p2 = exports.anchors[ i ];
            }

        }
        else
        {

            p2.x = ( exports.anchors[ i + 1 ].x + exports.anchors[ i ].x ) / 2;
            p2.y = ( exports.anchors[ i + 1 ].y + exports.anchors[ i ].y ) / 2;
            p2.z = ( exports.anchors[ i + 1 ].z + exports.anchors[ i ].z ) / 2;

        }


        var t1  = 1 - t;
        var t2 = t1 * t1;
        var t3 = 2 * t * t1;
        var t4 = t * t;

        return new Point(	t2 * p0.x + t3 * p1.x + t4 * p2.x,
                            t2 * p0.y + t3 * p1.y + t4 * p2.y );


    };

    exports.getPositionAt = function( t )
    {

        var length = exports.anchors.length;
        var i0 = Math.floor( length * t );
        i0 = i0 < length - 1 ? i0 : length - 1;
        var delta = 1 / length;
        return exports.computePointAt( i0, ( t - ( i0 * delta ) ) / delta );

    };

    return exports;

}({});