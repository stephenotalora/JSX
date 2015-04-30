/**
 * Created by jonathan otalora - A00894017 on 15-04-29.
 */

/**
 * inherits - defines inheritance chain
 * @param child
 * @param parent
 */
function inherits(child, parent){ // inheritance chain
    child.prototype = Object.create(parent.prototype);
    child.prototype.constructor = child;
}

/*****************************************************************************
 * Parent of all Interactive Pong Objects
 * @param initPos
 * @param initVel
 * @constructor
 *****************************************************************************/
function PongObject(initPos, initVel, color) {
    if (arguments.length < 3) { throw 'Illegal state exception'; }
    else if (!Array.isArray(initPos) || typeof initVel !== 'number') {
        throw 'Illegal argument exception';
    }

    // Otheriwse init object
    this.position = initPos;
    this.velocity = initVel;
    this.color = color;
}

// accessors/mutators
PongObject.prototype.getPosition = function() { return this.position; }
PongObject.prototype.getVelocity = function() { return this.velocity; }
PongObject.prototype.getColor = function() { return this.color; }
PongObject.prototype.setPosition = function(pos) {
    if (!pos || !Array.isArray(pos)){ throw 'Illegal argument exception'; }
    this.position = pos;
}
PongObject.prototype.setVelocity = function(vel) {
    if (typeof vel !== 'number') { throw 'Illegal argument exception'; }
    this.velocity = vel;
}
PongObject.prototype.toString = function() {
    return  "position[0]: " + this.getPosition()[0] +
            ", position[1]: " + this.getPosition()[1] +
            ", velocity: " + this.getVelocity() +
            ", color: " + this.getColor();
}


/*****************************************************************************
 * Paddle blue-print
 *****************************************************************************/
inherits(Paddle, PongObject); // inheritance chain
function Paddle(initPos, initVel, width, color) { // Default ctor for Paddle Object
    PongObject.call(this, initPos, initVel, color); // init super

    if (typeof width !== 'number'){ throw 'Illegal argument exception'; }

    // otherwise init paddle object
    this.width = width;

    // static var to keep track paddle screen instances
    PongObject.instanceCount = ++PongObject.instanceCount || 0 ;
}

/**
 * object instance count
 * @returns {string}
 */
Paddle.prototype.getInsanceCount = function() {
    return (PongObject.instanceCount < 10) ? ('0' + PongObject.instanceCount) : String(PongObject.instanceCount);
}

// accessors
Paddle.prototype.getWidth = function() { return this.width; }

/**
 * draws the paddle on the screen based on the current state of the object
 * @param ctx
 */
Paddle.prototype.draw = function(ctx) {
    if (!ctx) { throw 'cannot draw Paddle on canvas - did you pass the canvas context?'; }

    // otherwise draw the object
    Graphics.draw.line(
        ctx,
        this.getPosition()[0],
        this.getPosition()[1],
        this.getWidth(),
        this.getColor()
    );
}

/**
 * object representation
 * @returns {string}
 */
Paddle.prototype.toString = function() {
    return "Paddle-" + this.getInsanceCount() + " = { " +
        PongObject.prototype.toString.call(this) +
            ", width: " + this.width +
            ", height: " + this.height +
            " }" ;
}

/*****************************************************************************
 * Ball blue-print
 *****************************************************************************/
inherits(Ball, PongObject);
function Ball(initPos, initVel, radius, color) {
    PongObject.call(this, initPos, initVel, color); // init super!

    if (typeof radius !== 'number') { throw 'Illegal state exception'; }
    this.radius = radius;
    this.reachedTargetRadius = false;
}

// accessor
Ball.prototype.getRadius = function() { return this.radius; }

/**
 * draw
 * second param simple animates circle from radius 0 to target radius
 * @param ctx
 * @param hasAnimation
 */
Ball.prototype.draw = function(ctx, hasAnimation){
    if (!ctx) { throw 'cannot draw Ball on canvas - did you pass the canvas context?' }
    if (!hasAnimation) { drawCircle(this, this.getRadius()); }

    // otherwise must animate
    if (!this.reachedTargetRadius) {
        Ball.prototype.draw.incrementStep = ++Ball.prototype.draw.incrementStep || 0;
        drawCircle(this, Ball.prototype.draw.incrementStep);
        if (Ball.prototype.draw.incrementStep == this.getRadius()) { this.reachedTargetRadius = true; }
    } else { drawCircle(this, this.getRadius()); }

    function drawCircle(self, radius) {
        Graphics.draw.circle(ctx, self.getPosition(), radius);
    }
}

Ball.prototype.toString = function() {
    return "Ball = { " +
            PongObject.prototype.toString.call(this) +
            ", radius: " + this.radius +
            " } ";
}


