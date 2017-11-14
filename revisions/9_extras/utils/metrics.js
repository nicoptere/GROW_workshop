/**
 * Created by nico on 22/10/2015.
 */
var metrics = function(exports)
{
    /*******************
     *
     * stats
     *
     *******************/

    exports.mean = function( values )
    {
        var mean = 0;
        values.forEach( function( e, i, a )
        {
            mean += e.value;
        } );
        mean /= values.length;
        return mean;
    };

    exports.variance = function( values )
    {
        var result = 0;

        var mean_value = this.mean( values );
        var count = values.length;

        values.forEach( function( e, i, a )
        {
            result += Math.pow( ( e.value - mean_value ), 2 );
        } );
        return result / count;
    };

    /**
     * méthode qui renvoie les bornes d'une clé sur l'objet data
     * @param data le set de données
     * @param key la clé dont on veut récupérer les minimums/maximum
     * @returns {*[]} un tableau contenant les bornes minimums/maximum de la clé
     */
    exports.getBounds = function( data, key )
    {
        var min = Math.pow( 2, 53 );
        var max = -Math.pow( 2, 53 );

        data.forEach(function(obj) {

            min = Math.min( min, obj[key] );
            max = Math.max( max, obj[key] );

        });
        return [min, max];
    };

    /**
     * enlève les espaces de début et de fin de la chaîne de caractère
     */
    exports.trim = function( string )
    {
        return string.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    };

    /**
     * enlève les signes de ponctuation de la chaîne de caractère
     */
    exports.removePunctuation = function( string )
    {
        return string.replace(/[^\w\s]/gi, '');
    };

    return exports;

}({});