var kmeans = function(exports)
{

    function distance( a, b ){ return Math.sqrt( Math.pow(a.x - b.x, 2) +  Math.pow(a.y - b.y, 2) ); }
    function reduce( t,c ){var u,v;for ( var i = ( v = t[0], 1 ); i < t.length;) v = c(v,t[i],i++,t); i<2 & u && u(); return v;}
    function addIterator(x,y) { return x+y; }

    exports.compute = function( points, k, iterations )
    {

        iterations = iterations || 5;

        var l = points.length;
        k = k || Math.sqrt( l/2 );


        /** K-Means++ initialization */
        var i, j, cmp1, cmp2;

        /** determine the amount of tries */
        var D = [], ntries = 2 + Math.round(Math.log(k));

        /** 1. Choose one center uniformly at random from the data points. */
        var p0 = points[~~( Math.random() * l )];
        p0.centroid = 0;
        this.centroids = [p0];

        /**
         * 2. For each data point x, compute D(x), the distance between x and
         * the nearest center that has already been chosen.
         */

        for (i = 0; i < l; i++) {
            D[i] = Math.pow(distance(p0, points[i]), 2);
        }

        var Dsum = reduce(D, addIterator);

        /**
         * 3. Choose one new data point at random as a new center, using a
         * weighted probability distribution where a point x is chosen with
         * probability proportional to D(x)2.
         * (Repeated until k centers have been chosen.)
         */
        var centroids = [];
        for (j = 0; j < k; ++j) {

            var bestDsum = -1,
                bestIdx = -1;

            for (i = 0; i < ntries; ++i) {
                var rndVal = ~~( Math.random() * Dsum );

                for (var n = 0; n < l; ++n) {
                    if (rndVal <= D[n]) {
                        break;
                    }
                    else {
                        rndVal -= D[n];
                    }
                }

                var tmpD = [];
                for (var m = 0; m < l; ++m) {
                    cmp1 = D[m];
                    cmp2 = Math.pow(distance(points[m], points[n]), 2);
                    tmpD[m] = cmp1 > cmp2 ? cmp2 : cmp1;
                }

                var tmpDsum = reduce(tmpD, addIterator);
                if (bestDsum < 0 || tmpDsum < bestDsum) {
                    bestDsum = tmpDsum;
                    bestIdx = n;
                }
            }

            Dsum = bestDsum;

            var centroid =
            {
                x: points[bestIdx].x,
                y: points[bestIdx].y,
                centroid: j,
                items: 0
            };

            centroids.push(centroid);

            for (i = 0; i < l; ++i) {
                cmp1 = D[i];
                cmp2 = Math.pow(distance(points[bestIdx], points[i]), 2);
                D[i] = cmp1 > cmp2 ? cmp2 : cmp1;
            }

        }


        ////////////////////////////////////////////


        ////////////////////////////////////////////


        function iterate(k) {

            /** When the result doesn't change anymore, the final result has been found. */

            var converged = true;
            var sums = [];
            var i;
            for (i = 0; i < k; ++i) {
                sums.push({x: 0, y: 0, items: 0});
            }

            var closestItem = null;
            var dist, minDist;
            for (i = 0, l = points.length; i < l; ++i) {
                closestItem = null;
                minDist = 10e6;
                centroids.forEach(function (c) {
                    dist = distance(c, points[i]);
                    if (dist < minDist) {
                        closestItem = c;
                        minDist = dist;
                    }
                });


                //			var distances = sortBy( exports.centroids, measureDistance( exports.points, i ) );
                //			var closestItem = distances[ 0 ];
                var centroid = closestItem.centroid;

                /**
                 * When the point is not attached to a centroid or the point was
                 * attached to some other centroid before, the result differs from the
                 * previous iteration.
                 */
                if (typeof points[i].centroid !== 'number'
                    || points[i].centroid !== centroid) {
                    converged = false;
                }

                /** Attach the point to the centroid */

                points[i].centroid = centroid;

                /** Add the points' coordinates to the sum of its centroid */

                sums[centroid].x += points[i].x;
                sums[centroid].y += points[i].y;
                sums[centroid].items++;


            }

            /** Re-calculate the center of the centroid. */

            for (i = 0; i < k; i++) {

                if (sums[i].items > 0) {
                    centroids[i].x = sums[i].x / sums[i].items;
                    centroids[i].y = sums[i].y / sums[i].items;
                }
                centroids[i].items = sums[i].items;
            }

            return converged;
        }


        i = iterations;
        while (i--) {
            iterate(k);
        }

        return { centroids:centroids, points:points };

    };
    return exports;
}({});
