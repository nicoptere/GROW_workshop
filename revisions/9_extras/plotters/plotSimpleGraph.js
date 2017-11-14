//dessine les séries de valeurs sous forme de lignes
function simpleGraph( ctx, values0, values1 )
{
    //assigne le contexte à l'utilistaire de dessin
    G.ctx = ctx;

    //trace le graphe des températures en rouge
    ctx.strokeStyle = "#F00";
    G.polyline( values0 );

    //scatterplot des vitesse du vent en bleu
    ctx.fillStyle = "#09C";
    values1.forEach( function( p ){G.disc(p, 2);} );
}
