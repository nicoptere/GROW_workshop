var assetsLoader = function(exports ){

    var xhr, img, jl, queue, callback;
    var i = 0;
    exports.IMG = i++;
    exports.TXT = i++;
    exports.load = function( list, cb ){

        queue = list;
        callback = cb;

        xhr = new XMLHttpRequest();
        xhr.onload = onLoad;

        loadNext();

    };

    function loadNext(){

        if( queue.length === 0 ){
            if( callback )callback();
            return;
        }

        if( queue[0].type === assetsLoader.IMG ){
            var img = new Image();
            img.onload = onLoad;
            img.src = queue[0].url;
        }

        if( queue[0].type === assetsLoader.TXT
        ||  queue[0].type === assetsLoader.CHK ){
            xhr.open( "GET", queue[0].url );
            xhr.send();
        }

    }

    function onError( e ){
        console.log( e );
    }
    function onProgress( e ){
        console.log( e );
    }
    function onLoad( e ){

        if( queue[0].type === assetsLoader.IMG ){
            exports[ queue[0].name ] = e.target;
        }
        if( queue[0].type === assetsLoader.TXT ){
            exports[ queue[0].name ] = e.target.responseText;
        }
        if( queue[0].onLoad !== undefined ){
            queue[0].onLoad( exports[ queue[0].name ] );
        }
        queue.shift();
        loadNext();

    }

    return exports;

}({});