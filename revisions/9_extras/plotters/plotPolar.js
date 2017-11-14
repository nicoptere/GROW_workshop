//dessine un graphe polaire des valeurs
function plotPolar(ctx, inRadius, outRadius, data )
{

    //assigne le contexte à l'utilitaire de dessin
    G.ctx = ctx;

    //dessine des portions d'anneau en gris
    ctx.strokeStyle = "#ddd";
    data.forEach( function( obj, i ) {
        var a = i / data.length * PI2;
        var span = a + PI2 / data.length;
        G.strokeRing(width / 2, height / 2, inRadius, outRadius, a, span);
    });

    //dessine des portions d'anneau en bleu
    ctx.strokeStyle = ctx.fillStyle = "#09C";
    data.forEach( function( obj, i ){
        var a =  i / data.length * PI2;
        var span = a + PI2 / data.length;
        var r = map( obj.t, t_min, t_max, inRadius, outRadius );
        G.fillRing( width/2, height/2, inRadius,r, a, span  );
        G.strokeRing( width/2, height/2, inRadius,r, a, span  );
    });

    //dessine des portions d'anneau en jaune
    ctx.strokeStyle = ctx.fillStyle = "#FC0";
    data.forEach( function( obj, i ) {
        var a = i / data.length * PI2;
        var span = a + PI2 / data.length;
        var r = map(obj.ff, ff_min, ff_max, inRadius, outRadius);
        G.fillRing(width / 2, height / 2, inRadius, r, a, span);
        G.strokeRing(width / 2, height / 2, inRadius, r, a, span);
    });
}