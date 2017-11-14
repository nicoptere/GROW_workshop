//trace la différence entre vent et température
function compareHistogram( ctx, values0, values1 ){

    //assigne le contexte à l'utilistaire de dessin
    G.ctx = ctx;

    values0.forEach(function( v0,i  ){

        //récupère la valeur de values1 à cet index
        var v1 = values1[ i ];

        //si la valeur 0 est plus grande que la valeur 1
        var h = v1.y - v0.y;
        if( h < 0 ) {
            //dessine un bloc jaune
            ctx.fillStyle = "#FC0";
        }else{
            //sinon dessine un bloc bleu
            ctx.fillStyle = "#09C";
        }
        ctx.fillRect( v0.x, v0.y, width / data.length, h );

    } );
}