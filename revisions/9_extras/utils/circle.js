/**
 * Created by nico on 01/11/13.
 */
var Circle = function()
{
    function Circle( x, y, r )
    {
        this.x = x;
        this.y = y;
        this.r = r;
        this.scale = 1;
    }

	function lerp( t, origin, destination )
	{
		if( origin == null || destination == null )return;
		this.x = origin.x + t * ( destination.x - origin.x );
		this.y = origin.y + t * ( destination.y - origin.y );
		this.r = origin.r + t * ( destination.r - origin.r );
	}

	function minimumEnclosingCircle( points )
	{
		if( points == null || points.length == 0 ) return;
		// Knuth shuffle
		var shuffled = points.slice( 0);

		for (var i = points.length - 1; i >= 0; i--)
		{
			var j = Math.floor(Math.random() * (i + 1));
			j = Math.max(Math.min(j, i), 0);
			var temp = shuffled[i];
			shuffled[i] = shuffled[j];
			shuffled[j] = temp;
		}

		// Incrementally add points to circle
		var c = null;
		for ( i = 0; i < shuffled.length; i++)
		{
			var p = shuffled[i];
			if (c == null || !this.isInCircle(c, p.x, p.y))
			{
				c = this.circleOnePoint(shuffled.slice(0, i + 1), p);
			}
		}
		return c;
	}

	function circleOnePoint( points, p )
	{
		var c = new Circle( p.x, p.y, 0 );

		for( var i = 0; i < points.length; i++ )
		{
			var q = points[i];

			if (!this.isInCircle(c, q.x, q.y))
			{
				if (c.r == 0)
				{
					c = this.diameter(p, q);
				}
				else
				{
					c = this.circleTwoPoints( points.slice(0, i + 1), p, q );
				}
			}
		}
		return c;
	}


    function circleTwoPoints( points, p, q )
	{
		var temp = this.diameter(p, q);
		var containsAll = true;
		for (var i = 0; i < points.length; i++)
		{
			containsAll = containsAll && this.isInCircle(temp, points[i].x, points[i].y);
		}
		if (containsAll)
		{
			return temp;
		}

		var left = null;
		var right = null;
		for( i = 0; i < points.length; i++ )
		{
			var r = points[i];
			var cross = this.crossProduct(p.x, p.y, q.x, q.y, r.x, r.y);
			var c = this.circumcircle(p, q, r);

			if (cross > 0 && (left == null || this.crossProduct(p.x, p.y, q.x, q.y, c.x, c.y) > this.crossProduct(p.x, p.y, q.x, q.y, left.x, left.y)))
			{
				left = c;
			}
			else if( cross < 0 && (right == null || this.crossProduct(p.x, p.y, q.x, q.y, c.x, c.y) < this.crossProduct(p.x, p.y, q.x, q.y, right.x, right.y)))
			{
				right = c;
			}
		}
		return right == null || left != null && left.r <= right.r ? left : right;
	}


    function circumcircle(p0, p1, p2)
	{
		// Mathematical algorithm from Wikipedia: Circumscribed circle
		var ax = p0.x, ay = p0.y;
		var bx = p1.x, by = p1.y;
		var cx = p2.x, cy = p2.y;
		var d = (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by)) * 2;
		var x = ((ax * ax + ay * ay) * (by - cy) + (bx * bx + by * by) * (cy - ay) + (cx * cx + cy * cy) * (ay - by)) / d;
		var y = ((ax * ax + ay * ay) * (cx - bx) + (bx * bx + by * by) * (ax - cx) + (cx * cx + cy * cy) * (bx - ax)) / d;
		return new Circle(  x, y, this.distance(x, y, ax, ay) );
	}

    function diameter(p0, p1)
	{
		return new Circle(  (p0.x + p1.x) / 2,
							(p0.y + p1.y) / 2,
							this.distance(p0.x, p0.y, p1.x, p1.y) / 2 );
	}

	/* Simple mathematical functions */

    function isInCircle(c, x, y)
	{
		return c != null && this.distance(x, y, c.x, c.y) <= c.r;
	}

	// Returns twice the signed area of the triangle defined by (x0, y0), (x1, y1), (x2, y2)
    function crossProduct(x0, y0, x1, y1, x2, y2)
	{
		return (x1 - x0) * (y2 - y0) - (y1 - y0) * (x2 - x0);
	}

	function distance(x0, y0, x1, y1)
	{
		return Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));
	}

	function angle( p0, p1 ){return Math.atan2( p1.y - p0.y, p1.x - p0.x );}
	function project( p )
	{
	    var a = this.angle( this, p );
	    return new Point(    this.x + Math.cos( a ) * this.r,
	                         this.y + Math.sin( a ) * this.r    );
	}

    var _p = Circle.prototype;
    _p.constructor = Circle;
    
    _p.lerp = lerp;
    _p.minimumEnclosingCircle = minimumEnclosingCircle;
    _p.circleOnePoint = circleOnePoint;
    _p.circleTwoPoints = circleTwoPoints;
    _p.circumcircle = circumcircle;
    _p.diameter = diameter;
    _p.isInCircle = isInCircle;
    _p.crossProduct = crossProduct;
    _p.distance = distance;
    _p.angle = angle;
    _p.project = project;
    return Circle;
    
}();