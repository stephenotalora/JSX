/**
 * Created by jono on 15-04-29.
 */
function inherits(child, parent){
    child.prototype = Object.create(parent.prototype);
    child.prototype.constructor = child;
}

function PongObject(initPos, initVel) {
    if (arguments.length != 2) { throw 'Illegal state exception'; }
    else if (!Array.isArray(initPos) || typeof initVel !== 'number') {
        throw 'Illegal argument exception';
    }

    // Otheriwse init object
    this.position = initPos;
    this.velocity = initVel;
}

PongObject.prototype.getPosition = function() { return this.position; }
PongObject.prototype.getVelocity = function() { return this.velocity; }
PongObject.prototype.setPosition = function(pos) {
    if (!pos || !Array.isArray(pos)){ throw 'Illegal argument exception'; }
    this.position = pos;
}
PongObject.prototype.setVelocity = function(vel) {
    if (typeof vel !== 'number') { throw 'Illegal argument exception'; }
}