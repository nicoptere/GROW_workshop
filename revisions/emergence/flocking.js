///////////////////////////////////////  Flocking system
var id = 0;
function update() {
    requestAnimationFrame(update);
    ctx.clearRect(0, 0, w, h);

    //forces
    var separation = new Point();
    var cohesion = new Point();
    var alignment = new Point();

    //ratios
    separate = document.getElementById("separate").value;
    document.getElementById("sepLabel").innerHTML = separate;
    cohede = document.getElementById("cohesion").value;
    document.getElementById("cohLabel").innerHTML = cohede;
    align = document.getElementById("alignment").value;
    document.getElementById("aliLabel").innerHTML = align;
    friction = 1 - document.getElementById("friction").value;
    document.getElementById("friLabel").innerHTML = document.getElementById(
        "friction"
    ).value;

    boids.forEach(function(boid) {
        //reset forces
        separation.set(0, 0);
        cohesion.set(0, 0);
        alignment.set(0, 0);

        //tests proximity to all other boids
        boids.forEach(function(other) {
            //if it's the same object, bail out
            if (boid == other) return;

            //compute position delta
            var dx = boid.x - other.x;
            var dy = boid.y - other.y;

            //compute boids' distance
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < boid.separation) {
                separation.x += dx;
                separation.y += dy;
            } else {
                if (dist < boid.cohesion) {
                    cohesion.x += dx;
                    cohesion.y += dy;
                }
                if (dist < boid.alignment) {
                    alignment.x += other.speed.x;
                    alignment.y += other.speed.y;
                }
            }
        });

        //computes the total acceleration

        if (separation.length() > 0) {
            separation.normalize().multiplyScalar(separate);
            boid.acceleration.add(separation);
        }

        if (cohesion.length() > 0) {
            cohesion.normalize().multiplyScalar(cohede);
            boid.acceleration.sub(cohesion);
        }

        if (alignment.length() > 0) {
            alignment.normalize().multiplyScalar(align);
            boid.acceleration.sub(alignment);
        }
    });

    //then applies the changes
    boids.forEach(function(boid) {
        //adds acceleration
        boid.speed.add(boid.acceleration.multiplyScalar(friction));

        //add some noise
        boid.speed.x += (Math.random() - 0.5) * 2;
        boid.speed.y += (Math.random() - 0.5) * 2;

        //constrain speed
        boid.speed.x = Math.max(
            -boid.maxSpeed.x,
            Math.min(boid.speed.x, boid.maxSpeed.x)
        );
        boid.speed.y = Math.max(
            -boid.maxSpeed.y,
            Math.min(boid.speed.y, boid.maxSpeed.y)
        );

        //update boid's position
        boid.add(boid.speed);

        //maintain point on screen
        var margin = boid.alignment;
        if (boid.x < -margin) boid.x += w + margin;
        if (boid.y < -margin) boid.y += h + margin;
        if (boid.x > w + margin) boid.x -= w + margin;
        if (boid.y > h + margin) boid.y -= h + margin;

        //render
        circle(boid.x, boid.y, 2);
    });
}

//creates a 2D context
var canvas, w, h, ctx;
var separate = 0.1;
var cohede = 0.5;
var align = 0.01;
var friction = 0.01;
var boids = [];
window.onload = function() {
    canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    ctx = canvas.getContext("2d");

    for (var i = 0; i < 500; i++) {
        var boid = new Point(Math.random() * w, Math.random() * h);

        boid.acceleration = new Point(0, 0);

        boid.speed = new Point(Math.random() - 0.5, Math.random() - 0.5);
        boid.maxSpeed = new Point(2, 2);

        boid.separation = 50;
        boid.cohesion = 100;
        boid.alignment = 250;

        boids.push(boid);
    }
    update();
};
function circle(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
}

////////////////////////////// Point Class

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
    sub: function(p) {
        this.x -= p.x;
        this.y -= p.y;
        return this;
    },
    clone: function() {
        return new Point(this.x, this.y);
    },
    copy: function(p) {
        this.x = p.x;
        this.y = p.y;
        return this;
    },
    set: function(x, y) {
        this.x = x;
        this.y = y;
        return this;
    },
    length: function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    normalize: function(value) {
        var l = this.length();
        this.x /= l;
        this.y /= l;
        if (value != null) this.multiplyScalar(value);
        return this;
    },
    multiplyScalar: function(value) {
        this.x *= value;
        this.y *= value;
        return this;
    },
    direction: function(other) {
        return other.clone().sub(this).normalize();
    },
    negate: function() {
        this.x *= -1;
        this.y *= -1;
        return this;
    },
    dot: function(p) {
        return this.x * p.x + this.y * p.y;
    },
    equals: function(other) {
        return this.x == other.x && this.y == other.y;
    },
    midpoint: function(other) {
        return new Point((this.x + other.x) / 2, (this.y + other.y) / 2);
    }
};
function getAngle(a, b) {
    var dx = b.x - a.x;
    var dy = b.y - a.y;
    return Math.atan2(dy, dx);
}

function getDistance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}
