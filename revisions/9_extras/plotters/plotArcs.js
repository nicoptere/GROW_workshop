//dessine un graphe polaire des valeurs
function plotArcs(ctx, data )
{
    //assigne le contexte à l'utilitaire de dessin
    G.ctx = ctx;
    ctx.lineWidth = .25;

    var Y = height / 3 * 2;
    data.forEach( function( obj, i )
    {
        var r = map( obj.t, t_min, t_max, 0, width / 2 );
        ctx.strokeStyle = "#09C";
        G.arc( width / 2 - r / 2, Y, r / 2, -PI, 0 );

        r = map( obj.ff, ff_min, ff_max, 0, width / 2 );
        ctx.strokeStyle = "#F00";
        G.arc( width / 2 + r / 2, Y, r / 2, -PI, 0 );
    });

    ctx.strokeStyle = "#999";
    G.graduation( 1, Y, width-1, Y, 100, 5 );
    G.graduation( 1, Y, width-1, Y, 50, 10 );
    G.graduation( 1, Y, width-1, Y, 10, 15 );

}