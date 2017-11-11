
function pseudoRandom(x, y) {
    return ( ( Math.sin( Math.pow( x + 12.9898, 2 ) + Math.pow( y + 78.233, 2 ) ) ) * 43758.5453123 ) % 1;
}

function noise(x, y) {

    //gets the integer part
    var ix = parseInt(x);
    var iy = parseInt(y);

    // 2D cell corners
    var a = pseudoRandom(ix,iy);
    var b = pseudoRandom(ix+1, iy);
    var c = pseudoRandom(ix, iy+1);
    var d = pseudoRandom(ix+1, iy+1);

    //gets the fractional part
    var fx = (x % 1);
    var fy = (y % 1);
    var ux = fx * fx * (3.0 - 2.0 * fx);
    var uy = fy * fy * (3.0 - 2.0 * fy);

    //interpolate the 4 noises with fractional parts
    return (a * (1-ux) + b * ux) + (c - a) * uy * (1.0 - ux) + (d - b) * ux * uy;

}

function curlNoise( x, y, delta ){

    //sample 4 points around the current position (top, bottom, left, right )
    //at a 'delta' distance
    var p_x0 = noise( x-delta, y );
    var p_x1 = noise( x+delta, y );
    var p_y0 = noise( x, y-delta );
    var p_y1 = noise( x, y+delta );

    // then use :
    // the Y noise diff to get the X curl value
    // the X noise diff to get the Y curl value
    var cx = p_y1 - p_y0;
    var cy = p_x1 + p_x0;

    //this way the new values are not related to their 'dimension'
    //the new X comes from a noise on Y and don't use X noise value, same for Y

    var divisor = 1.0/ ( 2.0 * delta );
    return new Point( cx , cy );//.normalize();//.multiplyScalar( divisor );

}

function draw() {

    requestAnimationFrame(draw);

    ctx.clearRect(0,0,w,h);
    // ctx.fillStyle = 'rgba(255,255,255,.05)';
    // ctx.fillRect(0,0,w,h);
    ctx.globalAlpha = .1;

    agents.forEach(function(agent){

        agent.trail.push( agent.clone() );

        var scale = .01;// * ( Math.sin( Date.now() * 0.001)*.5+.5 ) + .0001;
        agent.add( curlNoise( ( offset.x + agent.x ) * scale, ( offset.y + agent.y ) * scale, 1 ).multiplyScalar( agent.speed ) );

        if( agent.trail.length > 200 )agent.trail.shift();
        G.polyline( agent.trail );

    })
}

var G = new Graphics(ctx);
var agents = [];
var offset;
function reset(){
    agents = [];
    offset = new Point(Math.random() * w, Math.random() * h)
    for( var i = 0; i < 500; i++ ){
        var p = Point.fromAngleDistance( Math.random() * PI2, h/4 );
        p.x += w/2;
        p.y += h/2;
        p.trail = [];
        p.speed = 1 + Math.random() * 10;
        agents.push( p )
    }
}
reset();
draw();

window.addEventListener('mousedown', reset )

///////////////////////////////////////////////////// 3D version
/*
function curlNoise3D( p, delta ){

    //sample 6 points around the current position (top, bottom, left, right,front, back)
    //at a 'delta' distance
    var p_x0 = noise( p.x-delta, p.y, p.z );
    var p_x1 = noise( p.x+delta, p.y, p.z );
    var p_y0 = noise( p.x, p.y-delta, p.z );
    var p_y1 = noise( p.x, p.y+delta, p.z );
    var p_z0 = noise( p.x, p.y, p.z-delta );
    var p_z1 = noise( p.x, p.y, p.z+delta );

    // then use :
    // the Y/Z noise diff to get the X curl value
    // the Z/X noise diff to get the Y curl value
    // the X/Y noise diff to get the Y curl value
    var x = p_y1 - p_y0 - p_z1 + p_z0;
    var y = p_z1 - p_z0 - p_x1 + p_x0;
    var z = p_x1 - p_x0 - p_y1 + p_y0;

    //this way the new values are not related to their 'dimension'
    //the new X comes from a noise on Y & Z and don't use X noise value, etc.

    var divisor = 1.0 / ( 2.0 * delta );
    return new Point( x , y , z ).normalize();//.multiplyScalar( divisor );

}
//*/