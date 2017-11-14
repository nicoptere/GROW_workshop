


function update() {

    requestAnimationFrame( update );

    //centers the drawing context around 0,0
    ctx.restore();
    ctx.clearRect(0,0,w,h);
    ctx.save();
    ctx.translate( w/2, h/2 );
    ctx.strokeStyle = "#000";

    //principle: trace the rotation of a circle rotating around another circle
    var circle0 = new Point(0,0);
    circle0.radius = h/4;
    circle(circle0.x, circle0.y, circle0.radius);

    //creates a smaller circle
    var circle1 = new Point(0,0);
    circle1.radius = h/12;

    //rotation speed around the big circle
    var time0 = Date.now() * 0.001;


    //EPICYCLOIDS : outside the circle

    //position around the big circle
    //( circle0.radius + circle1.radius ) will place the circle "outside" the big circle
    var cx = circle0.x + Math.cos( time0 ) * ( circle0.radius + circle1.radius );
    var cy = circle0.y + Math.sin( time0 ) * ( circle0.radius + circle1.radius );
    circle( cx, cy, circle1.radius);


    //position around the small circle
    var time1 = -time0 * 4;

    var px = cx + Math.cos( time1 ) * circle1.radius;
    var py = cy + Math.sin( time1 ) * circle1.radius;

    circle( px, py, 3 );

    //store the new position
    epicycloid.push( new Point( px, py ) );

    //render the curve in red
    ctx.strokeStyle = "#F00";
    ctx.beginPath();
    epicycloid.forEach( function(p ){
        ctx.lineTo( p.x, p.y );
    });
    ctx.stroke();
    if( epicycloid.length > 360 )epicycloid.shift();

    //HYPOCYCLOIDS : inside the circle

    ctx.strokeStyle = "#000";
    //position around the big circle
    //( circle0.radius + circle1.radius ) will place the circle "outside" the big circle
    var cx = circle0.x + Math.cos( time0 ) * ( circle0.radius - circle1.radius );
    var cy = circle0.y + Math.sin( time0 ) * ( circle0.radius - circle1.radius );
    circle( cx, cy, circle1.radius);


    //position inside the small circle
    var time1 = -time0 * 4;

    var px = cx + Math.cos( time1 ) * circle1.radius;
    var py = cy + Math.sin( time1 ) * circle1.radius;

    circle( px, py, 3 );

    //store the new position
    hypocycloid.push( new Point( px, py ) );

    //render the curve in red
    ctx.strokeStyle = "#00F";
    ctx.beginPath();
    hypocycloid.forEach( function(p ){
        ctx.lineTo( p.x, p.y );
    });
    ctx.stroke();
    if( hypocycloid.length > 360 )hypocycloid.shift();


}
var epicycloid = [];
var hypocycloid = [];
function circle( x,y,r ){
    ctx.beginPath();
    ctx.arc( x, y, r, 0, Math.PI * 2 );
    ctx.stroke();
}
update();
