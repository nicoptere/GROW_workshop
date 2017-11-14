function reset() {

    //creates a bunch of agents
    agents = [];
    for (var i = 0; i < 50; i++) {

        //random point position on the screen
        var agent = new Point( Math.random() * w, Math.random() * h );

        //this array will store the path of this agent
        agent.history = [];

        //angle, angular velocity and speed
        agent.angle = Math.random() * Math.PI * 2;
        agent.angleSpeed = 5 + Math.random() * 25;
        agent.speed = 2 + Math.random() * 3;

        agents.push( agent );

    }

}

function update(){

    requestAnimationFrame(update);

    ctx.clearRect(0,0,w,h);

    for(var i = 0; i < agents.length; i++ ){

        var agent = agents[i];

        //stores a copy of the current position
        agent.history.push( agent.clone() );

        //updates angle
        agent.angle += ( Math.random() - .5 ) * RAD * agent.angleSpeed;

        //updates poistion width the angle
        agent.x += Math.cos( agent.angle ) * agent.speed;
        agent.y += Math.sin( agent.angle ) * agent.speed;


        //constrains the length of the history to 100
        var maxLength = 50;
        if( agent.history.length > maxLength )agent.history.shift();

        // //drawing the history of this agent

        // ctx.beginPath();
        // agent.history.forEach( function( p ){
        //     ctx.lineTo( p.x, p.y );
        // } );
        // ctx.stroke();
        // continue;


        // //as we have a eries of points, we can process segments independently

        // for(var j = 0; j < agent.history.length - 1; j++ ){
        //
        //     var current = agent.history[ j ];
        //     var next = agent.history[ j+1 ];
        //
        //     ctx.lineWidth = 20 * ( j + 1 ) / agent.history.length;
        //
        //     ctx.beginPath();
        //     ctx.moveTo( current.x, current.y );
        //     ctx.lineTo( next.x, next.y );
        //     ctx.stroke();
        //
        // }
        // continue;


        // //and index any shaping function to change the drawing properties

        var time = 0;//Date.now() * .001;
        for(var j = 0; j < agent.history.length - 1; j++ ){

            var current = agent.history[ j ];
            var next = agent.history[ j+1 ];

            //normalised position along history path
            var t = ( j + 1 ) / agent.history.length;

            //prevents flickering
            t *= ( agent.history.length / maxLength ) ;

            var width = Math.abs( Math.sin( ( time + t ) * PI ) );

            // width *= Shaping.pcurve( 1-t, 0.2, 8 );

            // width = Shaping.sawtooth( (1-t) * 3 );

            // width = Shaping.sawtooth( Math.sin( t * PI2 ) * 3 );

            // width = Shaping.triangle( t * 4 );

            // width = ctx.globalAlpha = Shaping.square( t * 4.5 );

            // width = Shaping.cubicPulse( t , .1,.9 );
            // ctx.globalAlpha = Shaping.square( t * 4.5 );
            // ctx.lineCap = 'butt';
            // if( width < .5 )ctx.lineCap = 'round';

            // width = Math.abs( Shaping.square( t * 4.5 ) ) * Shaping.sawtooth( (1-t)  )* 5 ;

            ctx.lineWidth = 30 * width;



            ctx.beginPath();
            ctx.moveTo( current.x, current.y );
            ctx.lineTo( next.x, next.y );
            ctx.stroke();

        }
        continue;

        //or use geometric properties
        for(var j = 0; j < agent.history.length - 1; j++ ){

            var current = agent.history[ j ];
            var next = agent.history[ j+1 ];
            G.line( current, next );
            if( j % 6 != 0 || j < maxLength / 2 )continue;


            //normalised position along history path
            var t = ( j + 1 ) / agent.history.length;

            //prevents flickering
            // t *= ( agent.history.length / maxLength ) ;

            var offset = 5 * agent.speed;
            var r_norm = new Point( -( next.y - current.y ),  ( next.x - current.x ) ).normalize().multiplyScalar( offset ).add( current );
            var l_norm = new Point(  ( next.y - current.y ), -( next.x - current.x ) ).normalize().multiplyScalar( offset ).add( current );

            G.line( r_norm, next );
            G.line( l_norm, next );
            G.disc( current, 1 );

            if( j == agent.history.length - 2 ){
                ctx.beginPath();
                ctx.arc( current.x, current.y, offset, getAngle( current, r_norm ), getAngle(current,l_norm), true );
                ctx.stroke();
            }else{
                G.circle( r_norm, 3 );
                G.circle( l_norm, 3 );
            }

        }
    }
}


window.addEventListener("mousedown", reset, false);
var G = new Graphics( ctx );
var agents;
reset();
update();
