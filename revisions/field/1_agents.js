
var HPI = Math.PI / 2;

//method to draw an arrow
function drawArrow( p0, p1, size ){
    var a = getAngle( p0, p1 );
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p0.x + Math.cos( a + HPI ) * size, p0.y + Math.sin( a + HPI ) * size);
    ctx.lineTo(p1.x, p1.y);
    ctx.lineTo(p0.x + Math.cos( a - HPI ) * size, p0.y + Math.sin( a - HPI ) * size);
    ctx.fill();
}
//this is the value at a given X/Y location
function getValue( x, y ){
    return Math.cos( x ) * Math.sin( y ) + Date.now() * 0.0001;
}

function update() {

    requestAnimationFrame(update);
    ctx.clearRect(0,0,w,h);

    //draws an arrow at each point (lattice)
    ctx.globalAlpha = .2;
    cells.forEach( function( p, id ){

        //direction
        var angle = getValue( p.x, p.y );
        var p1 = new Point(
            p.x + Math.cos( angle ) * cellSize * .75,
            p.y + Math.sin( angle ) * cellSize * .75
        );
        //draw arrow
        drawArrow( p, p1, cellSize * .2 );

    });

    //for each agent
    var margin = 20;
    ctx.globalAlpha = 1;
    agents.forEach( function( agent ){

        //find in which cell the agent is
        var cell = new Point(   ~~( ( agent.x ) / cellSize ) * cellSize,
                                ~~( ( agent.y ) / cellSize ) * cellSize  );

        //evaluates the lattice's angle
        var angle = getValue( cell.x, cell.y );

        agent.x += Math.cos( angle ) * agent.speed;
        agent.y += Math.sin( angle ) * agent.speed;

        //bounds
        if( agent.x < -margin )agent.x += w + margin;
        if( agent.y < -margin )agent.y += h + margin;
        if( agent.x > w + margin )agent.x = -margin;
        if( agent.y > h + margin )agent.y = -margin;


        G.disc( agent, 5 );
    })

}
var G = new Graphics(ctx);
var total = 100;
var agents = [];
while( total-- ){
    var agent = new Point( Math.random() * w, Math.random() * h );
    agent.speed = 1 + Math.random() * 5;
    agents.push( agent );
}

//regular grid with 50px cells
var cellSize = 50;
var cells = [];
for( var i = 0; i <= w; i += cellSize ){
    for( var j = 0; j <= h; j += cellSize ){
        var cell = new Point(i,j);
        cell.angle = getValue( i, j );
        cells.push( cell );
    }
}
update();
