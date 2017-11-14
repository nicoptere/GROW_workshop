/**
 * @author Nicolas Barradeau
 */
var Polygon = function( id, scale ) {

	"use strict";

	this.id = id;
	this.renderMode = 1;
	if( id != -1 )
	{
		if( ShapeProvider.getMeansById( id) != null ) this.meanCoords = ShapeProvider.getMeansById( id).concat();
		this.init( ShapeProvider.toIntPointArray( ShapeProvider.getShapeById( id ).concat(), scale ) );

	}


};

Polygon.prototype =
{

	init : function( poly )
	{

		this.poly = poly;


		this.fStyle = "rgb( "   + parseInt( 0x80 + Math.random() * 0x80 ) +","
								+ parseInt( 0x80 + Math.random() * 0x80 ) +", "
								+ parseInt( 0x80 + Math.random() * 0x80 ) +" )";


		this.pattern = document.createElement('canvas');
		this.pattern.width = 40;
		this.pattern.height = 40;
		this.pctx = this.pattern.getContext('2d');
		for( var i = 0; i < 40; i++ )
		{
			for( var j = 0; j < 40; j++ )
			{
				this.pctx.fillStyle = "rgba( " + parseInt( Math.random() * 255 ) +","+ parseInt( Math.random() * 255 ) +","+ parseInt( Math.random() * 255 ) +","+ Math.random() +")";
				this.pctx.fillRect( i, j, 1,1 );
			}
		}

//		this.pctx.scale( .10,10 );
//		pctx.translate( 10,10 );

		this.A;
		this.B;

		this.color = 0;

		this.edgeList = [];
		this.edges = [];
		//list of polygons sharing a border
		this.connections = [];

		//series of polylines representing the skeleton of the shape
		this.skeleton = [];

		this.dir = 0;
		this.timer = 0;
		this.speed = 0.01;
		this.rect = this.AABB();

		this.center = new Point( this.rect.x + this.rect.width / 2 , this.rect.y + this.rect.height / 2 );
		this.canCut = false;

//		console.log( this.meanCoords )
		if( this.meanCoords != null )
		{
			var biUnitRect = new Rect(-1,-1,2,2);
			this.means = [];
			for( var i = 0; i < this.meanCoords.length; i+=2 )
			{
				var x = this.meanCoords[ i ];
				var y = this.meanCoords[ i+1 ];
				var p = new Point(0,0);
				p.x = Polygon.map( x, biUnitRect.x, biUnitRect.x + biUnitRect.width, this.rect.x, this.rect.x + this.rect.width );
				p.y = Polygon.map( y, biUnitRect.y, biUnitRect.y + biUnitRect.height, this.rect.y, this.rect.y + this.rect.height );
	//			console.log( x, y);
	//			console.log( '->',p.x, p.y )
				this.means.push( p );
			}

			this.means = Polygon.convexHull( this.means );

		}

		this.orientation = Polygon.CW;
		this.ip = new Point();

	},

	findColinearSegment : function( quad, edgeToAxisMinDistance, swapAxis )
	{

		//swapAxis = swapAxis || false;

		var p0 =/*swapAxis ? quad[ 2 ] : */quad[ 0 ],
			p1 =/*swapAxis ? quad[ 3 ] : */quad[ 1 ];

		if( p0 == null || p1 == null ) return;

		var debug = false,
			i,
			c,
			n,
			slopeEpsilon = .25,
			slope,
			refSlope = ( p1.y - p0.y ) / ( p1.x - p0.x ),
			minSlope = this.slope( this.poly[0], this.poly[1]),
			distSlope = 0,
			values = [];

		this.edgeList = [];
		this.edges = [];
		this.projections = [];

		for( i = 0; i < this.poly.length; i++ )
		{

			c = this.poly[ i ];
			n = this.poly[ ( i+1 ) % this.poly.length ];


			if( Polygon.nearEquals( c, Polygon.project( c, p0, p1, true ), edgeToAxisMinDistance )
			&&	Polygon.nearEquals( n, Polygon.project( n, p0, p1, true ), edgeToAxisMinDistance ) )
			{
				this.i0 = i;
				this.i1 = ( i + 1 ) % this.poly.length;
				this.edgeList.push( this.i0, this.i1 );
				continue;
			}

			slope = ( n.y - c.y ) / ( n.x - c.x );
			distSlope = Math.abs( refSlope - slope );

			if( distSlope <= minSlope + slopeEpsilon )
			{
				minSlope = distSlope;

				this.i0 = i;
				this.i1 = ( i + 1 ) % this.poly.length;
				this.edgeList.push( this.i0, this.i1 );

			}

		}

		if( debug )console.log( 'edgelist', this.edgeList, this.edgeList.length );

		if( this.edgeList.length <= 2 )
		{
			if( debug )console.log( 'edgelist <= 2 -> return' );
			this.edges = this.edgeList.concat();
			return;
		}

		for( i = 0; i < this.edgeList.length; i+= 2 )
		{

			c = this.poly[ this.edgeList[ i ] ];
			n = this.poly[ this.edgeList[ i+1 ] ];
			values.push( {
							id0:this.edgeList[ i ],
							id1:this.edgeList[ i+1 ],
							value: ( this.distance( c, this.project( c, p0, p1, false ) ) + this.distance( n, this.project( n, p0, p1, false ) ) / 2 )
			} );

		}

		values.sort( function( a, b ){ return ( a.value < b.value ? -1 : 1 ); } );
		if( debug )console.log( 'values -> ', values );
		if( debug )console.log( 'projections -> ', this.projections);

		this.edges = [];
		for( i = 0; i < values.length; i++ )
		{
			if( values[ i ].value < edgeToAxisMinDistance * 2 )
			{
				this.edges.push( values[ i ].id0, values[ i ].id1 );
			}
		}

		if( debug )console.log( this.edges );

	},

	findConnections : function( list, maxDist )
	{

		if( this.edges == null )
		{
			return;
		}
		if( this.edges.length == 0 )
		{
			return;
		}

		maxDist = maxDist || 1;

		var edges = this.edges;
		var poly = this.poly;

		this.connections = [];

		for( var i = 0; i < edges.length; i+=2 )
		{
			var p0 = poly[ edges[ i ] ];
			var p1 = poly[ edges[ i+1 ] ];

//			console.log( "polygon.findConnections e0, e1", edges[0], edges[1] );

			for( var k = 0; k < list.length; k++ )
			{
				var other = list[ k ];

				if( other == this )continue;
				for( var j = 0; j < other.edges.length; j+=2 )
				{
					var o0 = other.poly[ other.edges[ j ] ];
					var o1 = other.poly[ other.edges[ j+1 ] ];
//					console.log( "\to0, o1", other.edges[0], other.edges[1], Polygon.distance( p0, o0 ), maxDist );

					if( ( this.nearEquals( p0, o0, maxDist ) && this.nearEquals( p1, o1, maxDist ) )
					||  ( this.nearEquals( p0, o1, maxDist ) && this.nearEquals( p1, o0, maxDist ) )  )
					{

						this.connections.push( new Connection( this, p0, p1, other, o0, o1 ) );

					}
				}
			}
		}




	},

	nearEquals : function( a, b, epsilon )
	{
		var x = Math.abs( a.x - b.x );
		var y = Math.abs( a.y - b.y );
		return (x <= epsilon) && (y <= epsilon);
	},

	containsPoint : function( poly, x, y )
	{
	    for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
	        ((poly[i].y <= y && y < poly[j].y) || (poly[j].y <= y && y < poly[i].y))
	        && (x < (poly[j].x - poly[i].x) * (y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
	        && (c = !c);
	    return c;
	},


	render : function( ctx, highlight, px, py )
	{
		//inflate or deflate

		if( this.renderMode == 0 || this.poly == null || this.poly.length == 0 )return;

		ctx.strokeStyle = "rgba( 0,0,0,0 )";
		ctx.fillStyle = "#000";

		var value = 0;
		var col = "";
		var br = 0x91,
			bg = 0xe8,
			bb = 0x42;
		var dr, dg, db;
		if( highlight && this.canCut )
		{
			if( this.containsPoint( this.poly, px, py ) )
			{
				value = ( Math.abs( Math.sin( Date.now() * 0.002 ) ) );
				/*
				var grd=ctx.createLinearGradient( this.rect.x, this.rect.y, this.rect.width, this.rect.y );

	//		    91 e8 42
	//			d2 ff 52
				var c0 = "rgb( "+ parseInt( this.color * 0x91  ) +","+ parseInt( this.color * 0xe8  ) +", "+ parseInt( this.color * 0x42 ) +" )";
				var c1 = "rgb( "+ parseInt( 0x91 + value * ( 0xd2 - 0x91 ) ) +","
								+ parseInt( 0xe8 + value * ( 0xff - 0xe8 ) ) +", "
								+ parseInt( 0x42 + value * ( 0x42 - 0x52 ) ) +" )";

				grd.addColorStop(0,    c0);//"#91e842");
				grd.addColorStop(.5,   c1);//"#d2ff52");
				grd.addColorStop(1,    c0);//"#91e842");
				ctx.fillStyle=c1;
				//*/
//				value = 1;
				dr = ( 0xd2 - 0x91 );
				dg = ( 0xff - 0xe8 );
				db = ( 0x42 - 0x52 );
			}
			else
			{
				valuye = 0;
				br = bg = bb = 0;
				dr = dg = db = 255;

			}

//			else ctx.fillStyle = "#000";


//			col = "rgb( "   + parseInt( 0x91 + this.color * ( 0xd2 - 0x91 ) ) +","
//							+ parseInt( 0xe8 + this.color * ( 0xff - 0xe8 ) ) +", "
//							+ parseInt( 0x42 + this.color * ( 0x42 - 0x52 ) ) +" )";



		}
		else
		{
			valuye = 0;
			br = bg = bb = 0;
			dr = dg = db = 0;

		}
		this.color += ( value - this.color ) * .1;

		col = "rgb( "   + parseInt( this.color * br + this.color * dr ) +","
						+ parseInt( this.color * bg + this.color * dg ) +", "
						+ parseInt( this.color * bb + this.color * db ) +" )";

		ctx.fillStyle = col;

		ctx.beginPath();

		ctx.moveTo( this.poly[ 0 ].x, this.poly[ 0 ].y );
		for( var i = 0; i < this.poly.length; i++ )
		{
			ctx.lineTo( this.poly[ i ].x, this.poly[ i ].y );
		}
		ctx.closePath();
		ctx.fill();


	},

	alignTo : function( fromA, fromB, toA, toB, side )
	{

		var fa = new Point( fromA.x || fromA.x, fromA.y || fromA.y  );
		var fb = new Point( fromB.x || fromB.x, fromB.y || fromB.y  );

		var ta = new Point( toA.x || toA.x, toA.y || toA.y  );
		var tb = new Point( toB.x || toB.x, toB.y || toB.y  );


		var dpF = Polygon.sub( fa, fb );
		var dpT = Polygon.sub( ta, tb );
		var dir = 1;

		if( Polygon.dotProduct( dpF, dpT ) < 0 )
		{
			var tp = tb;
			tb = ta;
			ta = tp;
			dir = -1;
		}

		var p = new point(),
			pr, pl, //boolean: current point is left / right from slice axis
			n = new point(),
			nr, nl, //boolean: next point is left / right from slice axis
			pp = new point(),
			c = new point(),
			offset = new point(),
			dist = 0,
			toAngle = ( this.angle( ta, tb ) );


		var ratio = ( this.distance( fa, fb ) / this.distance( ta, tb) );

		//prevents collienar case from dividing by zero
		var epsilon = 1;
		if( fa.x == fb.x )fa.x += epsilon;
		if( fa.y == fb.y )fa.y += epsilon;
		if( ta.x == tb.x )ta.x += epsilon;
		if( ta.y == tb.y )ta.y += epsilon;

		var nps = [];
		var distances = [];
		for( var i = 0; i < this.poly.length - 1; i++ )
		{
			p = this.poly[ i ];
			n = this.poly[ i+1 ];


				pr = this.isRight( p, fa, fb );
				nr = this.isRight( n, fa, fb );

				//both are on the right side of the axis
				if( pr && nr )continue;

				pl = this.isLeft( p, fa, fb );
				nl = this.isLeft( n, fa, fb );


			//current is on the left and next is on the right side of the axis
			//or vice versa
			if( pl && nr || pr && nl )
			{
				p = this.lineIntersectLine( p, n, fa, fb, false, false );
			}

			if( p == null )continue;

			pp = this.project( p, fa, fb, false );

			dist = this.distance( p, pp ) / ratio;

			offset.x = Math.cos( toAngle + ( dir * Math.PI / 2 ) ) * dist;
			offset.y = Math.sin( toAngle + ( dir * Math.PI / 2 )  ) * dist;


			p = new Point(utils.map( pp.x, fa.x, fb.x, ta.x, tb.x ) + offset.x,
									    utils.map( pp.y, fa.y, fb.y, ta.y, tb.y ) + offset.y );
			nps.push( p );

			distances.push( {point:p, d:dist } );

		}

		this.findEndPointsOnAxis( ta, tb, nps );

		this.poly = nps;

		this.remapToAxis( this.A, this.B, ta, tb, this.poly );

		//shifts the whole polygon to start at one of the segment's ends
		var max = this.poly.length;
		var epsilon = 10;
		while(   !(     ( this.nearEquals( this.poly[ 0 ], ta, epsilon ) )
		||              ( this.nearEquals( this.poly[ 0 ], tb, epsilon ) )   )   )
		{
		    this.poly.push( this.poly.shift() );
			if( max-- <= 0 )break;
		}
		this.rect = this.AABB();
		return this.poly;

	},

	remapToAxis : function( origin0, origin1, dest0, dest1, points )
	{

		var p,
			t,
			dist,
			ratio = Polygon.distance( dest0, dest1 ) / Polygon.distance( origin0, origin1 );

		for( var i = 0; i < points.length; i++ )
		{

			p = points[ i ];

			t = Polygon.sub(  p, origin0 );
			dist =  Polygon.distance( p, origin0 );
			t = Polygon.normalizeVector( t, ratio * ( dist == 0 ? 1 : dist ) );

			if( isNaN( t.x ) || isNaN( t.y ) )
			{
				t.x = 0;
				t.y = 0;
			}

			points[ i ] = Polygon.add( dest0, t );

		}



		return points;

	},

	findEndPointsOnAxis : function( ta, tb, poly )
	{

		var collinear = [];
		for( var i = 0; i < poly.length; i++ )
		{
			p = poly[ i ];
			if( this.collinear( p.x, p.y, ta.x, ta.y, tb.x, tb.y ) )
			{
				collinear.push( p );
			}
		}

		if( collinear.length < 2 )
		{
			this.A = ta;
			this.B = tb;
		}
		else
		{
			collinear.sort( function( a, b )
			{
				return ( ta.x - a.x ) * ( ta.x - a.x ) + ( ta.y - a.y ) * ( ta.y - a.y ) < ( ta.x - b.x ) * ( ta.x - b.x ) + ( ta.y - b.y ) * ( ta.y - b.y ) ? - 1 : 1;
			} );
			this.A = collinear[ 0 ];
			this.B = collinear[ collinear.length - 1 ];
		}

	},

	/*******************
	 *
	 * utils
	 *
	 *******************/
	angle : function( p0, p1 ){return Math.atan2( p1.y - p0.y, p1.x - p0.x );},
	lerp : function( t, a, b ){ return a + t * ( b - a ); },
	norm : function( t, a, b ){ return ( t - a ) / ( b - a ); },
	map : function( t, a0, b0, a1, b1 ){ return utils.lerp( utils.norm( t, a0, b0 ), a1, b1 ); },

	slope : function( a,b  )
	{
		return ( b.y- a.y ) / ( b.x - a.x );
	},

	/* 3 points are strictly collinear */
	collinear : function( x1, y1, x2, y2, x3, y3 )
	{
		var v0 = (y1 - y2) * (x1 - x3);
		var v1 = (y1 - y3) * (x1 - x2);
		return v0 >= v1-1e-6 && v0 <= v1+1e-6 ;
	},

	squareDistance : function( a, b )
	{
		return ( a.x - b.x ) * ( a.x - b.x ) + ( a.y - b.y ) * ( a.y - b.y );
	},

	distance : function( a, b )
	{
		//console.log( 'dist', a.x, a.y, b.x, b.y );
		return Math.sqrt( this.squareDistance( a,b ) );
	},


	project : function( p, a, b, asSegment, out )
	{
		asSegment = asSegment || true;
		var dx = b.x - a.x;
		var dy = b.y - a.y;

		if ( asSegment && dx == 0 && dy == 0 )
		{
			return a;
		}

		var t = ( ( p.x - a.x ) * dx + ( p.y - a.y ) * dy) / ( dx * dx + dy * dy );

		if ( asSegment && t < 0)
		{
			return a;
		}
		else if ( asSegment && t > 1)
		{
			return b;
		}
		else
		{
			return new Point( ( a.x + t * dx ), ( a.y + t * dy ) );
		}
		return null;

	},
	determinant : function( x, y, a, b ){ 	return ( ( a.x - b.x ) * ( y - b.y ) ) - ( ( x - b.x ) * ( a.y - b.y ) );   },
	isLeft : function( p, a, b ){		    return this.determinant( p.x|| p.x, p.y|| p.y, a, b ) > 0;  	        },
	isRight : function( p, a, b ){          return this.determinant( p.x|| p.x, p.y|| p.y, a, b ) < 0;          	},

	midpoint : function ( p0, p1 ){return new point( p0.x + ( p1.x - p0.x ) / 2, p0.y + ( p1.y - p0.y ) / 2 );},


	lineIntersectLine : function(	A, B,
									E, F,
									AB, EF )
	{
		var x1 = A.x, y1 = A.y;
		var x2 = B.x, y2 = B.y;
		var x3 = E.x, y3 = E.y;
		var x4 = F.x, y4 = F.y;

		var d = (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4);
		if (d == 0) return null;

		var xi = ((x3-x4)*(x1*y2-y1*x2)-(x1-x2)*(x3*y4-y3*x4))/d;
		var yi = ((y3-y4)*(x1*y2-y1*x2)-(y1-y2)*(x3*y4-y3*x4))/d;

		if ( AB && ( xi < Math.min(x1,x2) || xi > Math.max(x1,x2) ) )return null;
		if ( EF && ( xi < Math.min(x3,x4) || xi > Math.max(x3,x4) ) )return null;

		this.ip.x = xi;
		this.ip.y = yi;
		return this.ip;
	},

	AABB : function()
	{
		var size = 10e6;
		var minx = size,
			miny = size,
			maxx = -size,
			maxy = -size;
		this.poly.forEach(
			function( e,i,a )
			{
				if( e.x < minx )minx = e.x;
				if( e.x > maxx )maxx = e.x;
				if( e.y < miny )miny = e.y;
				if( e.y > maxy )maxy = e.y;
			}
		);
		return new Rect( minx, miny, ( maxx - minx ), ( maxy - miny ) );
	},


	/*******************
	 *
	 * stats
	 *
	 *******************/

	mean : function( values )
	{
		var mean = 0;
		values.forEach( function( e, i, a )
		{
			mean += e.value;
		} );
        mean /= values.length;
		return mean;
	},

	variance : function( values )
	{
		var result = 0;

		var mean_value = this.mean( values );
		var count = values.length;

		values.forEach( function( e, i, a )
		{
			result += Math.pow( ( e.value - mean_value ), 2 );
		} );
		return result / count;
	},


	/*******************
	 *
	 * dispose
	 *
	 *******************/

	dispose : function ()
	{

		delete this.poly;
		delete this.fStyle;
		delete this.sStyle;

		delete this.dispatcher;

		delete this.dir;
		delete this.timer;
		delete this.speed;

	},

	normalize : function( margin, scale )
	{
		scale = scale || 1;

//		var polygon = new Polygon( -1 );
//		polygon.init( [] );

		for( var i = 0; i < this.poly.length; i++ )
		{

//			polygon.poly.push(  new Point(
//								margin + this.map( this.poly[ i ].x, this.rect.x, this.rect.x + this.rect.width,     0, scale + margin * 2 ),
//								margin + this.map( this.poly[ i ].y, this.rect.y, this.rect.y + this.rect.height,    0, scale + margin * 2 )    )   );

			this.poly[ i ].x = margin + this.map( this.poly[ i ].x, this.rect.x, this.rect.x + this.rect.width,     0, scale + margin * 2 );
			this.poly[ i ].y = margin + this.map( this.poly[ i ].y, this.rect.y, this.rect.y + this.rect.height,    0, scale + margin * 2 );
		}
		return this;
	},

	scale : function( sx, sy )
	{
		sx = sx || 1;
		sy = sy || 1;
		for( var i = 0; i < this.poly.length; i++ )
		{
			this.poly[ i ].x *= sx;
			this.poly[ i ].y *= sy;
		}
		return this;
	},

	translate : function( tx, ty )
	{
		tx = tx || 1;
		ty = ty || 1;
		for( var i = 0; i < this.poly.length; i++ )
		{
			this.poly[ i ].x += tx;
			this.poly[ i ].y += ty;
		}
		return this;
	}
};

Polygon.dotProduct = function( p0, p1 )
{
	return p0.x * p1.x + p0.y * p1.y;
}

Polygon.removeDuplicatePoints = function( pts, epsilon )
{
	epsilon = epsilon || 0;
    var i,j;

    for( i = 0; i < pts.length; i++ )
    {
        for( j = (i+1); j < pts.length; j++ )
        {
//            if( pts[i].x == pts[ j ].x && pts[i].y == pts[ j ].y )
            if( Polygon.nearEquals( pts[i], pts[ j ], epsilon ) )
            {
	            pts.splice( j, 1 );
	            j--;
            }
        }
    }
    return pts;
};

Polygon.lineIntersectLine = function(	A, B, E, F, AB, EF )
{
	var x1 = A.x, y1 = A.y;
	var x2 = B.x, y2 = B.y;
	var x3 = E.x, y3 = E.y;
	var x4 = F.x, y4 = F.y;
	var d = (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4);
	if (d == 0) return null;
	var xi = ((x3-x4)*(x1*y2-y1*x2)-(x1-x2)*(x3*y4-y3*x4))/d;
	var yi = ((y3-y4)*(x1*y2-y1*x2)-(y1-y2)*(x3*y4-y3*x4))/d;
	if ( AB && ( xi < Math.min(x1,x2) || xi > Math.max(x1,x2) ) )return null;
	if ( EF && ( xi < Math.min(x3,x4) || xi > Math.max(x3,x4) ) )return null;

	return new Point( xi, yi );
};

Polygon.project = function( p, a, b, asSegment, out )
{
	asSegment = asSegment || true;
	var dx = b.x - a.x;
	var dy = b.y - a.y;
	if ( asSegment && dx == 0 && dy == 0 )	return a;
	var t = ( ( p.x - a.x ) * dx + ( p.y - a.y ) * dy) / ( dx * dx + dy * dy );
	if ( asSegment && t < 0)return a;
	if ( asSegment && t > 1)return b;
	return new Point( ( a.x + t * dx ), ( a.y + t * dy ) );
};

Polygon.midpoint = function ( p0, p1 ){return new Point( p0.x + ( p1.x - p0.x ) / 2, p0.y + ( p1.y - p0.y ) / 2 );};

Polygon.lerp = function( t, a, b ){ return a + t * ( b - a ); };
Polygon.norm = function( t, a, b ){ return ( t - a ) / ( b - a ); };
Polygon.map = function( t, a0, b0, a1, b1 ){ return utils.lerp( utils.norm( t, a0, b0 ), a1, b1 ); };

Polygon.angle =function( p0,p1 ){return Math.atan2( p1.y - p0.y, p1.x - p0.x );}

Polygon.distance = function( a, b ){return Math.sqrt( this.squareDistance( a,b ) );};
Polygon.squareDistance = function( a, b ){return ( a.x - b.x ) * ( a.x - b.x ) + ( a.y - b.y ) * ( a.y - b.y );};

Polygon.manhattan = function( p0, p1 ){ return Math.abs( this.u_manhattan( p0, p1 ) );}
Polygon.u_manhattan = function( p0, p1 ){ return ( p0.x - p1.x ) + ( p0.y - p1.y );}

Polygon.orientation = function( points ){	if( points.length < 3 ) return 0; return isLeft( points[1], points[0], points[2] ) ? Polygon.CW : Polygon.CCW;   }

Polygon.determinant = function( x, y, a, b ){ 	return ( ( a.x - b.x ) * ( y - b.y ) ) - ( ( x - b.x ) * ( a.y - b.y ) );   };
Polygon.isLeft = function( p, a, b ){		    return this.determinant( p.x|| p.x, p.y|| p.y, a, b ) > 0;  	        };
Polygon.isRight = function( p, a, b ){          return this.determinant( p.x|| p.x, p.y|| p.y, a, b ) < 0;          	};

Polygon.rightNormalVector = function( p0, p1 ){return new Point( -( p1.y - p0.y ), ( p1.x - p0.x ) );};
Polygon.leftNormalVector = function( p0, p1 ){return new Point(    ( p1.y - p0.y ), -( p1.x - p0.x ) );};
Polygon.leftNormal = function( p0, p1 ){return new Point( p0.x + ( p1.y - p0.y ), p0.y - ( p1.x - p0.x ) );};
Polygon.rightNormal = function( p0, p1 ){return new Point( p0.x - ( p1.y - p0.y ), p0.y + ( p1.x - p0.x ) );};
Polygon.vectorLength = function( p ){return Math.sqrt( p.x * p.x + p.y * p.y );};
Polygon.normalizeVector = function ( p, scale ){ scale = scale || 1;var l = this.vectorLength( p );p.x /= l; p.x *= scale; p.y /= l;p.y *= scale;return p;};

Polygon.add = function ( p0, p1 ){ return new Point( p0.x + p1.x, p0.y + p1.y ); };
Polygon.sub = function ( p0, p1 ){ return new Point( p0.x - p1.x, p0.y - p1.y ); };
Polygon.nearEquals = function( a, b, epsilon ){var x = Math.abs( a.x - b.x );var y = Math.abs( a.y - b.y );return (x <= epsilon) && (y <= epsilon);};

Polygon.area = function(points){var i, p, n, sum = 0;	for( i = 0; i < points.length - 1; i++ )	{		p = points[ i ];		n = points[ i+1 ];		sum += ( p.x * n.y ) - ( p.y * n.x );	}	return sum * .5;}
Polygon.contains = function( poly, x, y )
{
    for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
        ((poly[i].y <= y && y < poly[j].y) || (poly[j].y <= y && y < poly[i].y))
        && (x < (poly[j].x - poly[i].x) * (y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
        && (c = !c);
    return c;
}
Polygon.convexHull = function( points ){if( points.length <= 3 ) return points;points.sort( function( a,b ){return a.x - b.x;} );var angle = Math.PI / 2;var point = points[ 0 ];var hull = [];var max = points.length * 2;while ( point != hull[ 0 ] && max > 0  ){   hull.push( point );   var bestAngle = 0xFFFFFF;var bestIndex = 0;for ( var i = 0; i < points.length; i++ ){var testPoint = points[i];if (testPoint == point){continue;}            var dx = testPoint.x - point.x;var dy = testPoint.y - point.y;            var testAngle = Math.atan2(dy,dx);            testAngle -= angle;            while (testAngle < 0)testAngle += Math.PI * 2;            if ( testAngle < bestAngle ){bestAngle = testAngle;bestIndex = i;}        }        point = points[bestIndex];angle += bestAngle;        max--;    }    if( max <= 0 )    {        console.log( 'hull failed' );        return chainHull_2D( points );    }    return hull;}
Polygon.normalizeCoordinates = function( polygon, margin, sx, sy )
{
	margin = margin || 0;
	sx = sx || 1;
	sy = sy || 1;
	var tmp = [];
	for( var i = 0; i < polygon.poly.length; i++ )
	{
		var p = new Point();
		p.x = margin + this.map( polygon.poly[ i ].x, polygon.rect.x, polygon.rect.x + polygon.rect.width,     margin, sx + margin * 2 );
		p.y = margin + this.map( polygon.poly[ i ].y, polygon.rect.y, polygon.rect.y + polygon.rect.height,    margin, sy + margin * 2 );
		tmp.push( p );
	}
	return tmp;
}
Polygon.clonePoints = function( polygon )
{
	if( polygon == undefined )return [];
	var points = polygon.poly || polygon;
	var tmp = [];
	for( var i = 0; i < points.length; i++ )
	{
		var p = new Point( points[ i ].x, points[ i ].y );
		tmp.push( p );
	}
	return tmp;
}
Polygon.mapPointToRect = function( p, src, dest )
{
	p.x = Polygon.map( p.x, src.x, src.x + src.width, dest.x, dest.x + dest.width );
	p.y = Polygon.map( p.y, src.y, src.y + src.height, dest.y, dest.y + dest.height );
	return p;
}
Polygon.projectPointOnPath = function( p, poly )
{

	if( poly.length == 1 )return poly[ 0 ];

	var dist = 0,
		minDist = 10e10,
		best,
		pp;

	for( var i = 0; i< poly.length-1; i++ )
	{
		pp = Polygon.project( p, poly[i], poly[i+1], true, pp );

		dist = Polygon.squareDistance( p, pp );

		if( dist < minDist )
		{
			minDist = dist;
			best = pp;
		}
	}
	return best;
}

/**
 * returns the angle difference between segments P-A and P-B
 * @param p
 * @param a
 * @param b
 * return a value between 0 - Math.PI
 */
Polygon.angleDifference = function( p, a, b )
{
	var a0 = this.angle( p, a );
	var a1 = this.angle( p, b );
	var diff = Math.abs( a1 - a0 );// % Math.PI;
	return diff;
}

Polygon.shortestAngle = function( center, p0, p1 )
{
    var angle = this.angle( p0, center );
    var destAngle = this.angle( p1, center );

    if ( Math.abs( destAngle - angle ) > Math.PI )
    {
        if ( destAngle > angle ) angle += Math.PI * 2;
        else destAngle += Math.PI * 2;
    }
    return [ angle, destAngle ];
}

Polygon.endpointsOnAxis = function( p0, p1, points )
{
	var p,
		pp,
		dist,
		distA,
		distB,
		tmp = [];

	for( var i = 0; i < points.length; i++ )
	{
		p = points[ i ];
		if( p == null )continue;

		pp = this.project( p, p0, p1, false );
		if( pp == null )continue;

		dist = this.distance( p, pp );
		distA = this.distance( p, p0 );
		distB = this.distance( p, p1 );

		tmp.push( { point: pp, dist:dist, distA: distA, distB: distB } );

	}

	var out = [];

	tmp.sort( function( a, b ){ return ( a.dist < b.dist ) ? - 1 : 1; });
	tmp.sort( function( a, b ){ return ( a.distA < b.distA ) ? - 1 : 1; });
	out.push( tmp[0].point );

	tmp.sort( function( a, b ){ return ( a.dist < b.dist ) ? - 1 : 1; });
	tmp.sort( function( a, b ){ return ( a.distB < b.distB ) ? - 1 : 1; });
	out.push( tmp[0].point );

	return out;

}
Polygon.closestPointsToAxis = function( p0, p1, points )
{
	var p,
		pp,
		dist,
		tmp = [];

	for( var i = 0; i < points.length; i++ )
	{
		p = points[ i ];
		if( p == null )continue;

		pp = this.project( p, p0, p1, false );
		dist = this.distance( p, pp );
		tmp.push( { point: pp, dist:dist } );

	}

	tmp.sort( function( a, b ){ return ( a.dist < b.dist ) ? - 1 : 1; });
	return tmp;
}

