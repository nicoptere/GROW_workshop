
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


var Point = function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
    return this;
};
Point.prototype = {
    add: function(p) {
        this.x += p.x;
        this.y += p.y;
        return this;
    },
    set: function(x, y) {
        this.x = x;
        this.y = y;
        return this;
    },
    copy: function(p) {
        this.x = p.x;
        this.y = p.y;
        return this;
    }
};

var Cairo = function(ctx, count) {
    count = count || 30;

    var w = ctx.canvas.width;
    var h = ctx.canvas.height;
    var cell = Math.min(w, h) / count;

    this.update = function(dx, dy, scale, multiplier) {
        dx = dx || 0;
        dy = dy || 0;
        ctx.beginPath();
        for (var i = 0; i < w; i += cell) {
            for (var j = 0; j < h; j += cell) {
                splitQuad( i, j, cell, Math.abs( Math.abs( noise(i * scale + dx, j * scale + dy) ) * multiplier)
                );
            }
        }
        ctx.stroke();
    };

    var lattice = new Point();
    var p0 = new Point();
    var p1 = new Point();
    var p2 = new Point();
    var p3 = new Point();
    function splitQuad(x, y, c, t) {
        var cx = x + c * 0.5;
        var cy = y + c * 0.5;

        var axis_v = [new Point(cx, y), new Point(cx, y + c)];
        var axis_h = [new Point(x, cy), new Point(x + c, cy)];

        lattice.set(cx, y);
        p0.set(0, 0);
        p1.set(c / 2 * t, 0);
        p2.set(c / 2 * (1 - t), c / 2);
        p3.set(c / 2, c / 2);

        var line = [p0, p1, p2, p3];
        line.forEach(function(p) {
            p.add(lattice);
        });
        symmetries(line, axis_h, axis_v);

        var pivot = new Point(cx + c / 4, cy + c / 4);
        line.forEach(function(p) {
            p.copy(rotate(p, pivot, PI / 2));
        });
        symmetries(line, axis_h, axis_v);
    }

    function symmetries(line, h, v) {
        render(line);
        line.forEach(function(p) {
            p.copy(reflect(p, h[0], h[1]));
        });
        render(line);
        line.forEach(function(p) {
            p.copy(reflect(p, v[0], v[1]));
        });
        render(line);
        line.forEach(function(p) {
            p.copy(reflect(p, h[0], h[1]));
        });
        render(line);
    }

    function render(l) {
        ctx.moveTo(l[0].x, l[0].y);
        l.forEach(function(p) {
            ctx.lineTo(p.x, p.y);
        });
    }

    function distance(a, b) {
        var dx = a.x - b.x;
        var dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function angle(a, b) {
        var dx = a.x - b.x;
        var dy = a.y - b.y;
        return Math.atan2(dy, dx);
    }

    function rotate(p, lattice, angleDelta) {
        var a = angle(lattice, p) + angleDelta;
        var d = distance(lattice, p);

        var pp = new Point();
        pp.x = lattice.x + Math.cos(a) * d;
        pp.y = lattice.y + Math.sin(a) * d;
        return pp;
    }

    function reflect(p, a, b) {
        var dx = b.x - a.x;
        var dy = b.y - a.y;
        var t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy);
        var pp = new Point(a.x + t * dx, a.y + t * dy);
        return new Point(p.x + (pp.x - p.x) * 2, p.y + (pp.y - p.y) * 2);
    }
};

var canvas = document.createElement("canvas");
document.body.appendChild(canvas);
var w = (canvas.width = window.innerWidth);
var h = (canvas.height = window.innerHeight);
var ctx = canvas.getContext("2d");
var PI = Math.PI;

var cairo = new Cairo(ctx, 20);

function update() {
    requestAnimationFrame(update);

    ctx.clearRect(0, 0, w, h);
    var t = Date.now() * 0.001;
    cairo.update(t, Math.sin(t), 0.001, 1 );
}
window.onload = function(){
    update();
}