
//déclaration de 2 variables w et h pour stocker la taille de l'écran
var w = window.innerWidth;
var h = window.innerHeight;

//méthode de création d'un contexte graphique
function getContext(w,h) {

    var canvas = document.createElement( "canvas" );
    canvas.width = w;
    canvas.height = h;
    return canvas.getContext( "2d" );
}

//creation du contexte 2D
var ctx = getContext( w, h );
var canvas = ctx.canvas;
document.body.appendChild( canvas );


//étend le contexte sur toute la surface de la fenêtre et assigne les valeurs de w et h
function onResize(){

    w = window.innerWidth;
    h = window.innerHeight;
    ctx.canvas.width = w;
    ctx.canvas.height = h;
}
window.addEventListener( "resize", onResize, false );



//méthodes utiles
function lerp ( t, a, b ){ return a * ( 1 - t ) +  t * b; }
function norm( t, a, b ){return ( t - a ) / ( b - a );}
function map( t, a0, b0, a1, b1 ){ return lerp( norm( t, a0, b0 ), a1, b1 );}

//constantes
var PI = Math.PI;
var PI2 = PI * 2;
var RAD = PI / 180;

//save file to disk
var dl = document.createElement( 'a' );
function save( ctx, id, cb ){

    ctx.canvas.toBlob(function(blob) {
        // dl.href = ctx.canvas.toDataURL('image/png');

        dl.href = URL.createObjectURL(blob);
        dl.download = id + ".png";
        dl.click();

        id++;
        if( cb )setTimeout( cb, 1, id );
    });

}