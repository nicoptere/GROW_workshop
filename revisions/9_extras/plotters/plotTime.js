//dessine une valeur normalisée T le long d'une série de segments
function plotTime(ctx, values, t )
{
    //assigne le contexte à l'utilistaire de dessin
    G.ctx = ctx;

    //dessine une ligne graduée
    ctx.fillStyle = ctx.strokeStyle = "#EEE";
    G.graduation( 0,height, width-1, height, data.length, -20 );

    var id = ( Math.floor( ( values.length - 1 ) * t ) );
    if( id < 0 ) id = 0;

    //dessine le rectangle où se trouve le point en gris
    ctx.fillRect( values[ id ].x, 0, width / data.length, height );

    //trace la courbe des températures en noir
    ctx.strokeStyle = "#666";
    G.polyline( values );

    //dessine le point au temps T sur la courbe
    ctx.fillStyle = "#F00";
    var p = getPositionAt( values, t );
    G.disc( p, 2 );

    //dessine en bleu les points de la courbe
    //entre lesquels se trouve le point p
    ctx.fillStyle = "#09C";

    p = values[ id ];
    G.disc(p, 2 );

    p = values[ Math.min( id +  1, values.length - 1 ) ];
    G.disc(p, 2 );

}
