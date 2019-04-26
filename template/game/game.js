// The default starting scene
// (c) Insert your name here

// Game scene
let Game = function() {

    this.name = "game";
}


// Initialize
Game.prototype.init = function(evMan, g) {

    // Create components that do not require assets
    this.cam = new Camera(0, 0);
}


// On load
Game.prototype.onLoad = function(assets, evMan, g) {

    // Create components that require assets
    this.objm = new ObjectManager(assets, g);
    this.stage = new Stage(assets);
}


// Update
Game.prototype.update = function(evMan, tm) {

    // Update objects
    this.objm.update(evMan, this.cam, tm);
    this.objm.stageCollision(this.stage, this.cam, tm);

    // Update stage
    this.stage.update(evMan, tm);
}


// Draw
Game.prototype.draw = function(g) {

    // Reset camera
    g.setTranslation();
    // Clear to gray
    g.clear(170, 170, 170);

    // Draw background
    this.stage.drawBackground(g, this.cam);

    // Use camera
    this.cam.use(g);

    // Draw stage
    this.stage.draw(g, this.cam);
    // Draw objects
    this.objm.draw(g);
}
