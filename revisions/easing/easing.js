
// from http://gizma.com/easing/

var Easing = {};
// quadratic easing in - accelerating from zero velocity
Easing.linear = function (t) {
    return t;
};

// quadratic easing in - accelerating from zero velocity
Easing.inQuad = function (t) {
    return t*t;
};
// quadratic easing out - decelerating to zero velocity
Easing.outQuad = function (t) {
    return -t*(t-2);
};
// quadratic easing in/out - acceleration until halfway, then deceleration
Easing.inOutQuad = function (t) {
    t *= 2;
    if (t < 1) return .5*t*t;
    t--;
    return -.5 * (t*(t-2) - 1);
};
// cubic easing in - accelerating from zero velocity
Easing.inCubic = function (t) {
    return t*t*t;
};
// cubic easing out - decelerating to zero velocity
Easing.outCubic = function (t) {
    t--;
    return (t*t*t + 1);
};
// cubic easing in/out - acceleration until halfway, then deceleration
Easing.inOutCubic = function (t) {
    t *= 2;
    if (t < 1) return .5*t*t*t;
    t -= 2;
    return .5*(t*t*t + 2);
};
// quartic easing in - accelerating from zero velocity
Easing.inQuart = function (t) {
    return t*t*t*t;
};
// quartic easing out - decelerating to zero velocity
Easing.outQuart = function (t) {
    t--;
    return -(t*t*t*t - 1);
};
// quartic easing in/out - acceleration until halfway, then deceleration
Easing.inOutQuart = function (t) {
    t *= 2;
    if (t < 1) return .5*t*t*t*t;
    t -= 2;
    return -.5 * (t*t*t*t - 2);
};
// quintic easing in - accelerating from zero velocity
Easing.inQuint = function (t) {
    return t*t*t*t*t;
};
// quintic easing out - decelerating to zero velocity
Easing.outQuint = function (t) {
    t--;
    return (t*t*t*t*t + 1);
};
// quintic easing in/out - acceleration until halfway, then deceleration
Easing.inOutQuint = function (t) {
    t *= 2;
    if (t < 1) return .5*t*t*t*t*t;
    t -= 2;
    return .5*(t*t*t*t*t + 2);
};
// sinusoidal easing in - accelerating from zero velocity
Easing.inSine = function (t) {
    return 1-Math.cos( t  * (Math.PI/2));
};
// sinusoidal easing out - decelerating to zero velocity
Easing.outSine = function (t) {
    return Math.sin(t * (Math.PI/2));
};
// sinusoidal easing in/out - accelerating until halfway, then decelerating
Easing.inOutSine = function (t) {
    return -.5 * (Math.cos(Math.PI*t) - 1);
};
// exponential easing in - accelerating from zero velocity
Easing.inExpo = function (t) {
    return Math.pow( 2, 10 * (t - 1) );
};
// exponential easing out - decelerating to zero velocity
Easing.outExpo = function (t) {
    return ( -Math.pow( 2, -10 * t ) + 1 );
};
// exponential easing in/out - accelerating until halfway, then decelerating
Easing.inOutExpo = function (t) {
    t *= 2;
    if (t < 1) return .5 * Math.pow( 2, 10 * (t - 1) );
    t--;
    return .5 * ( -Math.pow( 2, -10 * t) + 2 );
};
// circular easing in - accelerating from zero velocity
Easing.inCirc = function (t) {
    return -(Math.sqrt(1 - t*t) - 1);
};
// circular easing out - decelerating to zero velocity
Easing.outCirc = function (t) {
    t--;
    return Math.sqrt(1 - t*t);
};
// circular easing in/out - acceleration until halfway, then deceleration
Easing.inOutCirc = function (t) {
    t *= 2;
    if (t < 1) return -.5 * (Math.sqrt(1 - t*t) - 1);
    t -= 2;
    return .5 * (Math.sqrt(1 - t*t) + 1);
};
