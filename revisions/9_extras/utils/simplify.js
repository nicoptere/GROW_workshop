/**
 * Created by nico on 06/11/13.
 */
 //adapted from http://geometryalgorithms.com/Archive/algorithm_0205/algorithm_0205.htm

		//original copyright message follows

		// Copyright 2002, softSurfer (www.softsurfer.com)
		// This code may be freely used and modified for any purpose
		// providing that this copyright notice is included with it.
		// SoftSurfer makes no warranty for this code, and cannot be held
		// liable for any real or imagined damage resulting from its use.
		// Users of this code must verify correctness for their application.

		/**
		 * This method will reduce a 2D complex polyline.
		 * @param tol the tolerance of the reduction algorithm. Higher numbers will simplify the line more.
		 * @param V the array of Tuple2fs to be simplified
		 * @return an array of Tuple2f representing the simplified polyline
		 */

var simplify = new function(exports){


    exports.compute = function( vertices, tol )
    {


        var n = vertices.length;
        var i, b, k, m, pv = 0;
        var tol2 = tol * tol;

        var tmp = new Array( n );
        var marked = new Array( n );

        for ( b = 0; b < n; b++)
        {
            marked[ b ] = 0;
        }

        //STAGE 1 simple vertex reduction
        tmp[0] = vertices[0];

        for (i = k = 1, pv = 0; i < n; i++)
        {
            if ( exports.distanceSquared( vertices[ i ], vertices[ pv ] ) < tol2 ) continue;

            tmp[k++] = vertices[i];

            pv = i;

        }

        //adding last Vertex
        if (pv < n - 1) tmp[k++] = vertices[n - 1];

        //STAGE 2 Douglas-Peucker polyline simplify
        //mark the first and last vertices
        marked[0] = marked[k - 1] = 1;

        exports.simplify( tol, tmp, 0, k - 1, marked );

        //copy marked vertices to output
        var out = [];
        for (i = m = 0; i < k; i++)
        {

            if (marked[i] == 1) out.push(tmp[i]);

        }

        return out.concat();

    };


    exports.simplify = function( tol, v, j, k, mk )
    {

        if( k <= j+1 ) return;  //nothing to simplify

        var maxi = j;
        var maxd2 = 0;
        var tol2 = tol * tol;

        var u = new Point( v[ k ].x- v[j].x, v[k].y - v[j].y );//v[ k ].subtract(v[j]);

        var cu = (u.x*u.x + u.y*u.y);

        var Pb = new Point(0,0);//points
        var b = 0, cw = 0, dv2 = 0;
        var i;
        for ( i = j + 1; i < k; i++ )
        {
            v.x = v[i].x-v[j].x;
            v.y = v[i].y-v[j].y;
            cw = u.x*v.x + u.y*v.y;

            if (cw <= 0)
            {
                dv2 = exports.distanceSquared(v[i],v[j]);
            }
            else if (cu <= cw)
            {
                dv2 = exports.distanceSquared(v[i],v[k]);
            }
            else
            {
                b = cw / cu;
                u.x *= -b;
                u.y *= -b;
                Pb.x = v[j].x- u.x;
                Pb.y = v[j].y- u.y;
                dv2 = exports.distanceSquared(v[i], Pb);
            }

            if (dv2 <= maxd2) continue;
            maxi = i;
            maxd2 = dv2;

        }

        if (maxd2 > tol2)
        {

            mk[maxi] = 1;
            exports.simplify(tol, v, j, maxi, mk);
            exports.simplify(tol, v, maxi, k, mk);

        }
    };

    exports.distanceSquared = function( a, b )
    {
        return ( ( a.x - b.x ) * ( a.x - b.x ) + ( a.y - b.y ) * ( a.y - b.y ) );
    };
    return exports;

}({});
