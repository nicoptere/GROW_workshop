var convexhull = function(exports)
{
        exports.compute = function( points )
        {

            if( points.length <= 3 ) return points;
            points.sort( function( a,b ){return a.x - b.x;} );
            var angle = Math.PI / 2;
            var point = points[ 0 ];
            var hull = [];
            var max = points.length * 2;
            while ( point != hull[ 0 ] && max > 0  )
            {
                hull.push( point );
                var bestAngle = Math.pow( 2, 53 );
                var bestIndex = 0;
                for ( var i = 0; i < points.length; i++ ){

                    var testPoint = points[i];
                    if (testPoint == point)continue;

                    var dx = testPoint.x - point.x;
                    var dy = testPoint.y - point.y;
                    var testAngle = Math.atan2(dy,dx) - angle;

                    while (testAngle < 0) {
                        testAngle += Math.PI * 2;
                    }
                    if ( testAngle < bestAngle ){
                        bestAngle = testAngle;bestIndex = i;
                    }
                }
                point = points[bestIndex];
                angle += bestAngle;
                max--;
            }
            return hull;

        };

        return exports;

}({});