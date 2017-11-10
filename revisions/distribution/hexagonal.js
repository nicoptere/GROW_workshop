function draw(){

    requestAnimationFrame(draw);
    ctx.clearRect(0,0,w,h);

    //measures of an equalateral triangle
    var sides = 6;
    var L = 2 * Math.sin( Math.PI / sides ); //side length
    var A = L / ( 2 * Math.tan( Math.PI / sides ) ); //apothem
    var H = ( 1 + A ); //radius + apothem

    ctx.globalAlpha = .5;

    var radius = 100;
    var countX = Math.round( w / ( radius*2 ) ) + 2;
    var countY = Math.round( h / ( radius*2 ) ) + 2;

    for( var i = 0; i < countX; i++ ){

        for( var j = 0; j < countY; j++ ){

            var x = ( i + ( j%2 === 1 ? .5 : 0 ) ) * radius * 2 * A;
            var y = j * ( radius * ( 1 + L * .5 ) );

            G.disc( x,y, 2 );

            drawHexagon( x, y, radius );

        }
    }
}
function drawHexagon( x,y, radius ){

    var step  = PI / 3;     // 60°
    var start = step / 2;   // 30°

    ctx.beginPath();
    for( var k = 0; k < 6; k++ ){

        var p = Point.fromAngleDistance( start + k * step, radius );// cos/sin( angle ) * radius
        p.x += x;
        p.y += y;
        ctx.lineTo(p.x, p.y);

    }
    ctx.closePath();
    ctx.stroke();

}

var G = new Graphics(ctx);
draw();