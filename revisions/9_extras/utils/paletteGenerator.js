var paletteGenerator = (function(exports){

    var RAD = ( Math.PI / 180 );
    var DEG = ( 180 / Math.PI );
    var GOLDEN_ANGLE = Math.PI * ( 3 - Math.sqrt( 5 ) );

    exports.generate = function( count, steps ){

        count = count || 10;

        var colors = [];
        var angle = ( Math.random() * Math.PI * 2 );
        var delta = ( GOLDEN_ANGLE / ( Math.max( 1, steps || 25 ) ) );
        var sat = "50%";
        var lum = "50%";

        while( count-- )
        {
            angle += delta;
            var color = 'hsl( ' + angle * DEG +', '+ sat +', '+ lum +")";
            colors.push( color );
        }
        return colors;
    };

    return exports;
})({});