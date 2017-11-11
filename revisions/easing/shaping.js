var Shaping = {};

Shaping.square = function ( n ){
    return Math.sin( n * PI2 ) > 0 ? 1 : .5;
};

Shaping.sawtooth = function ( n ){
    return ( n - Math.floor( n ) );
};

Shaping.triangle = function ( n ){
    return  ( .5 - Math.abs( n - Math.floor( n + .5 ) ) );
};

//  Function from Iñigo Quiles
//  www.iquilezles.org/www/articles/functions/functions.htm

Shaping.pcurve = function (x, a, b) {
    var k = Math.pow(a + b, a + b) / (Math.pow(a, a) * Math.pow(b, b));
    return k * Math.pow(x, a) * Math.pow(1.0 - x, b);
};

Shaping.impulse = function (k, x) {
    var h = k * x;
    return h * Math.exp(1.0 - h);
};

Shaping.parabola = function (x, k) {
    return Math.pow(4.0 * x * (1.0 - x), k);
};

Shaping.cubicPulse = function (c, w, x) {
    x = Math.abs(x - c);
    if (x > w) return 0.0;
    x /= w;
    return 1.0 - x * x * (3.0 - 2.0 * x);
};

Shaping.gain = function (x, k) {
    var a = 0.5 * Math.pow(2.0 * ((x < 0.5) ? x : 1.0 - x), k);
    return (x < 0.5) ? a : 1.0 - a;
};

Shaping.expStep = function (x, k, n) {
    return Math.exp(-k * Math.pow(x, n));
};
