//stocke les K-moyens de l'ensemble de points
var Kmeans;
//dessine les K-moyens
function plotKmeans( ctx, values0, values1 ){

    //assigne le contexte à l'utilitaire de dessin
    G.ctx = ctx;

    //arrière plan en violet foncé
    ctx.fillStyle = "#260A30";
    ctx.fillRect( 0,0,width, height);

    //crée une palette de couleurs
    var colors = [ "#583354", "#EF8166", "#FEC091", "#FDEFBE" ];

    //concatène les valeurs des 2 tablkeaux
    var values = values0.concat( values1 );

    //calcule et stocke les K-moyens une fois pour toutes
    //(un peu lourd à calculer)
    if( Kmeans == null )
    {
        Kmeans = kmeans.compute( values, colors.length, 100 );
    }

    var centroids = Kmeans.centroids;
    var points = Kmeans.points;
    //dessine les clusters reliés à leur centroids
    points.forEach(function( p ){
        ctx.fillStyle = ctx.strokeStyle = colors[ p.centroid ];
        G.disc(p.x, p.y,2 );
        G.line( p, centroids[ p.centroid ] )
    } );

    //dessine les centroids
    centroids.forEach(function( p, i )
    {
        ctx.fillStyle = ctx.strokeStyle = colors[i];
        G.disc(p.x, p.y, p.items / 2 );
    } );
}