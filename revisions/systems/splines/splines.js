var G = new Graphics(ctx);

function draw(){

    ctx .fillStyle = "#FFF";
    ctx.globalAlpha = 1;
    ctx.fillRect( 0,0,w,h );
    ctx.fillStyle = "#000";


    //creates a line at the top of the screen
    var points = [];
    for( var i = -50; i <= w + 50; i+=50 ){
        points.push( new Point( i, h/2 + ( Math.random() - .5 ) * h/3 ) );
    }
    ctx.save();
    ctx.lineJoin = "round";

    //cardinal curve
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#06C";
    var card = cardinal.compute( points, .05, 3, false );
    G.polyline( card );

    //catmull rom curve
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#FC0";
    var catmull = catmullrom.compute( points, .1, false );
    G.polyline( catmull );

    //quadratic curve
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#E00";
    var quad = quadratic.compute( points, .1, false );
    G.polyline( quad );

    ctx.restore();
    ctx.lineWidth = 1.5;
    G.polyline( points );

}
canvas.addEventListener('mousedown', draw);
draw();

