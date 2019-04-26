// Stage object template
// (c) Insert your name here


// Constructor
let Stage = function(assets) {

    // ...

    // Room size
    this.roomWidth = 0;
    this.roomHeight = 0;
}


// Update
Stage.prototype.update = function(evMan, tm) {

    // ...
}


// Draw background
Stage.prototype.drawBackground = function(g, cam) {

    // ...
}


// Draw
Stage.prototype.draw = function(g, cam) {

    // ...

    this.roomWidth = g.canvas.width;
    this.roomHeight = g.canvas.height;
}


// Player collision
Stage.prototype.playerCollision = function(pl, tm) {

    // Collision with borders
    pl.floorCollision(0, this.roomHeight, this.roomWidth, tm);
    pl.ceilingCollision(0, 0, this.roomWidth, tm);
    pl.wallCollision(1, this.roomWidth, 0, this.roomHeight, tm);
    pl.wallCollision(-1, 0, 0, this.roomHeight, tm);
}
