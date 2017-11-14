var TXTLoader = function(){

    function TXTLoader()
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
                    //enlève la ponctuation

                    var value = str.replace(/[^\w\s]/gi, '');

                    return  value.split( scope.separator )

                        //enlève les blocs vides

                        .filter( function( str )
                        {
                            return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '').length != 0;
                        });
                });

            //appelle la méthode de rappel en lui passant le tableau de mots
            scope.callback( data );

        };
    }


    function load( url, callback, separator )
    {
        this.callback = callback;
        this.separator = separator || " ";

        this.req.open( "GET",  url );
        this.req.send();

    }

    var _p = TXTLoader.prototype;
    _p.constructor = TXTLoader;
    _p.load = load;
    return TXTLoader;

}();