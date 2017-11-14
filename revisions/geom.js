//une classe point qui stocke 2 coorodnnées X et Y
var Point = function (x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    return this;
};
Point.prototype = {
    add: function (p) {
        this.x += p.x;
        this.y += p.y;
        this.z += p.z;
        return this;
    },
    sub: function (p) {
        this.x -= p.x;
        this.y -= p.y;
        this.z -= p.z;
        return this;
    },

    angle: function (other) {
        var dx = other.x - this.x;
        var dy = other.y - this.y;
        return Math.atan2(dy, dx);
    },
    distance: function (other) {
        var dx = other.x - this.x;
        var dy = other.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    },

    cross: function (a, b) {
        if (b === null) a = this;
        var p = new Point();
        p.x = a.y * b.z - a.z * b.y;
        p.y = a.z * b.x - a.x * b.z;
        p.z = a.x * b.y - a.y * b.x;
        return p;
    },

    clone: function () {
        return new Point(this.x, this.y, this.z);
    },
    copy: function (p) {
        this.x = p.x;
        this.y = p.y;
        this.z = p.z;
        return this;
    },
    set: function (x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    },
    length: function () {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    },
    normalize: function (value) {
        var l = this.length();
        this.x /= l;
        this.y /= l;
        this.z /= l;
        if (value != null) this.multiplyScalar(value);
        return this;
    },
    multiplyScalar: function (value) {
        this.x *= value;
        this.y *= value;
        this.z *= value;
        return this;
    },
    direction: function (other) {
        return other.clone().sub(this).normalize();
    },
    negate: function () {
        this.x *= -1;
        this.y *= -1;
        this.z *= -1;
        return this;
    },
    dot: function (p) {
        return this.x * p.x + this.y * p.y + this.z * p.z;
    },
    equals: function (other) {
        return this.x == other.x && this.y == other.y && this.z == other.z;
    },
    nearEquals: function (p, dist) {
        var x = Math.abs(this.x - p.x);
        var y = Math.abs(this.y - p.y);
        var z = Math.abs(this.z - p.z);
        return (x <= dist) && (y <= dist) && (z <= dist);
    },
    midpoint: function (other) {
        return new Point((this.x + other.x) / 2, (this.y + other.y) / 2, (this.z + other.z) / 2);
    },
    pointAt: function (t, other) {
        return new Point(
            lerp(t, this.x, other.x),
            lerp(t, this.y, other.y),
            lerp(t, this.z, other.z)
        );
    },
    randomize: function (amount) {
        this.x += ( Math.random() - .5 ) * amount;
        this.y += ( Math.random() - .5 ) * amount;
        this.z += ( Math.random() - .5 ) * amount;
        return this;
    },
    toString: function () {
        return "x: " + this.x + " y: " + this.y + " z: " + this.z;
    }
};

//des méthodes statiques

Point.cross = function (a, b) {
    var p = new Point();
    p.x = a.y * b.z - a.z * b.y;
    p.y = a.z * b.x - a.x * b.z;
    p.z = a.x * b.y - a.y * b.x;
    return p;
};
var getAngle = Point.getAngle = function (a, b) {
    var dx = b.x - a.x;
    var dy = b.y - a.y;
    return Math.atan2(dy, dx);
};
var getDistance = Point.getDistance = function (a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    var dz = a.z - b.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
};
Point.pointAtAngleRadius = function (angle, radius) {
    return new Point(Math.cos(angle) * radius, Math.sin(angle) * radius);
};

Point.midPoint = function (p0, p1) {
    return new Point(p0.x + ( p1.x - p0.x) * .5, p0.y + ( p1.y - p0.y) * .5, p0.z + ( p1.z - p0.z) * .5);
};

Point.length = function (p) {
    return Math.sqrt(( p.x * p.x ) + ( p.y * p.y ) + ( p.z * p.z ));
};
Point.add = function (a, b) {
    return new Point(a.x + b.x, a.y + b.y);
};
Point.sub = function (a, b) {
    return new Point(a.x - b.x, a.y - b.y);
};
Point.fromAngleDistance = function (angle, distance) {
    return new Point(Math.cos(angle) * distance, Math.sin(angle) * distance);
};


function getPositionAt(points, t) {

    var length = points.length - 1;
    var i0 = Math.floor(length * t);
    i0 = i0 < length - 1 ? i0 : length - 1;
    var i1 = Math.min(i0 + 1, length);

    var delta = 1 / length;
    var nt = ( t - ( i0 * delta ) ) / delta;
    return points[i0].pointAt( nt, points[i1] );
}


var Rectangle = function () {
    function Rectangle(x, y, w, h) {
        this.x = x || 0;
        this.y = y || 0;
        this.width = w || 0;
        this.height = h || 0;

        this.cx = this.cy = 0;
        this.center = new Point();
        this.getCenter();

    }

    function union(other) {
        this.x = Math.min(other.x, this.x);
        this.y = Math.min(other.y, this.y);
        this.width = Math.max(other.width, this.width);
        this.height = Math.max(other.height, this.height);
        return this;
    }

    function getCenter() {
        this.cx = this.center.x = this.x + this.w / 2;
        this.cy = this.center.y = this.y + this.h / 2;
        return this.center;
    }

    function containsPoint(x, y) {
        if (x < this.x) return false;
        if (y < this.y) return false;
        if (x > this.x + this.w) return false;
        return y <= this.y + this.h;
    }

    function isContained(x, y, w, h) {
        return (    this.x >= x
            && this.y >= y
            && this.x + this.w <= x + w
            && this.y + this.h <= y + h );
    }

    function intersect(x, y, w, h) {
        return !(  x > this.x + this.w || x + w < this.x || y > this.y + this.h || y + h < this.y );
    }

    function intersection(b) {

        var a = this;

        var x = Math.max(a.x, b.x);
        var num1 = Math.min(a.x + a.w, b.x + b.w);
        var y = Math.max(a.y, b.y);
        var num2 = Math.min(a.y + a.h, b.y + b.h);

        if (num1 >= x && num2 >= y) {

            var dx = Math.max(a.x, b.x);
            var dy = Math.max(a.y, b.y);
            return new Rect(x, y, num1 - dx - x, num2 - dy - y);
        }
        else return null;
    }

    function equals(other) {
        return (  other.x == this.x && other.y == this.y && this.width == this.width && other.height == this.height );
    }

    function scale(value) {
        this.x += value * this.w;
        this.y += value * this.h;
        this.w -= value * this.w * 2;
        this.h -= value * this.h * 2;
    }

    function clone() {
        return new Rectangle(this.x, this.y, this.width, this.height);
    }

    var _p = Rectangle.prototype;
    _p.constructor = Rectangle;
    _p.union = union;
    _p.getCenter = getCenter;
    _p.containsPoint = containsPoint;
    _p.isContained = isContained;
    _p.intersect = intersect;
    _p.intersection = intersection;
    _p.equals = equals;
    _p.scale = scale;
    _p.clone = clone;
    return Rectangle;
}();