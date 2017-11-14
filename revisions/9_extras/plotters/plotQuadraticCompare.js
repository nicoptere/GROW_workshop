//dessine les connexions entre deux séries réorganisées
function plotQuadraticCompare( ctx, data, values0, values1 )
{
    //assigne le contexte à l'utilistaire de dessin
    G.ctx = ctx;

    //positionne et écrit les titres des colonnes
    var left = 50, right = width - 50;
    G.text( 'T', 16, left + 10, 20 );
    G.text( 'FF', 16, right - 16, 20 );

    //tableaux temporaires pour stocker les valeurs sous forme d'objets
    var ts = [], ffs = [];
    data.forEach( function(item, i ){
        ts.push( { id : i, val : item.t,      x: left + 10 } );
        ffs.push( { id : i, val : item.ff,    x:right - 10 } );
    });

    //classe et dessine les temperatures par ordre croissant
    ts.sort( function(a,b){ return a.val - b.val });
    ts.forEach(function(o, i) { G.text(o.val, 5, o.x, 40 + i * 7  ); });

    //classe et dessine les vitesses du vent  par ordre croissant
    ffs.sort( function(a,b){ return a.val - b.val });
    ffs.forEach(function(o, i){ G.text(o.val, 5, o.x, 40 + i * 7 ); });

    //crée 4 variables pour dessiner les courbes (points de controle)
    var a = new Point(), b = new Point(), c = new Point(), d = new Point();
    ts.forEach( function( o, i ){

        a.x = o.x + 25;
        b.x = o.x + 25 + width / 2;
        a.y = b.y = 40 + i * 7;

        var ff = ffs[o.id ];
        c.x = ff.x - 3 - width / 2;
        d.x = ff.x - 3;
        c.y = d.y = 40 + o.id * 7;

        //dessine en rouge ou en bleu si la température arrive avant ou
        //après le vent dans la liste réorganisée (on compare les Y, pas VAL )
        if( a.y < c.y )ctx.strokeStyle = "rgba(255,0,0,.5)";
        else ctx.strokeStyle = "rgba(0,153,204,.5)";

        G.bezierCurve(a,b,c,d );

    });
}
