var CSVLoader = function(){

    function CSVLoader()
    {

        this.req = new XMLHttpRequest();
        var scope = this;
        this.req.onload = function( e )
        {
            //un tableau d'objets
            var data = [];

            //on isole chaque ligne du fichier reçu

            data = e.target.responseText.split( "\n")

                //on enlève les entrées vides

                .filter( function( str )
                {
                    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '').length != 0;
                })

                //convertit chaque entrée en tableau de valeurs

                .map( function( str )
                {
                    return  str.split( scope.separator )
                        //caste les valeurs numériques en chiffres
                        .map( function( s )
                        {
                            if( !isNaN( parseFloat( s ) ) )return parseFloat( s );
                            return s;
                        });
                })

                //convertit chaque entrée en objet pour pouvoir accéder plus facilement aux informations

                .map( function( input, i, arr )
                {
                    //on crée un objet pour stocker les infos

                    var obj = {};

                    //on se sert des clés de la première entrée

                    var keys = arr[ 0 ];
                    keys.forEach( function( key, id )
                    {
                        obj[ key ] = input[ id ];
                    });

                    return obj;
                });


            //on supprime la première entrée (le descriptif des champs )
            data.shift();

            //appelle la méthode de rappel en lui passant le tableau d'objets
            scope.callback( data );

        };
    }


    function load( url, callback, separator )
    {
        this.callback = callback;
        this.separator = separator || ";";

        this.req.open( "GET",  url );
        this.req.send();

    }

    var _p = CSVLoader.prototype;
    _p.constructor = CSVLoader;
    _p.load = load;
    return CSVLoader;

}();