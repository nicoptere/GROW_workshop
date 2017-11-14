//dessine le "polygone convexe englobant" d'un set de points
//(convex hull)
function plotHull( ctx, data )
{

    //assigne le contexte à l'utilitaire de dessin
    G.ctx = ctx;

    //dessine un graphe des valeurs polarisées
    var polar = [];
    ctx.strokeStyle = "#CCC";
    G.graduation( 0,height/2, width, height/2, 40, 5 );
    G.graduation( width/2,0, width/2, height, 30, 5 );

    data.forEach( function( obj, i )
    {
        var a = i / data.length * PI2;//angle

        var r = map( obj.t, t_min, t_max, height/8, height / 2 );//rayon
        var p = new Point(  width / 2 + Math.cos( a )  * r,
                            height / 2 + Math.sin( a ) * r );
        polar.push( p );

        G.disc( p, 2 );

    } );
    G.polyline( polar, true );
    polar.forEach( function(p){ G.disc( p, true ); } );

    //dessine le convex hull en rouge
    ctx.strokeStyle = "#f00";
    G.polyline( convexhull.compute( polar ), true );

}