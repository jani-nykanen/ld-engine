//
// LDEngine 
// Application core
// (c) 2019 Jani Nykänen
//


// Constructor
let Core = function() {

    // Scenes
    this.scenes = new Array();
    this.activeScene = null;

    // Framerate (default is 30)
    // Affects only the game logic
    this.framerate = 30;

    // Old timestamp & time sum
    this.oldTime = -1;
    this.timeSum = 0;
}


// Initialize
Core.prototype.init = function() {

    // Create components
    this.graphics = new GraphicsCore();
    this.input = new InputManager();
    this.evMan = null;

    // Set default listeners
    window.addEventListener("resize", () => {
        this.graphics.resize(window.innerWidth, 
                             window.innerHeight);
        }
    );
}


// Update
Core.prototype.update = function(delta) {

    // We compare delta time to this "target
    // framerate"
    const COMPARED_FRAMERATE = 60;

    // Calculate time multiplier
    let tm = delta / (1.0/COMPARED_FRAMERATE)

    // Update the active scene
    if(this.activeScene != null &&
       this.activeScene.update != null) {

        this.activeScene.update(this.evMan, tm);
    }

    // TODO: Update input & gamepad
}


// Draw
Core.prototype.draw = function() {

    // TEMPORARY!
    this.graphics.clear(170, 170, 170);

    // Draw the active scene
    if(this.activeScene != null &&
        this.activeScene.draw != null) {
 
         this.activeScene.draw(this.graphics);
     }
}


// Loop
Core.prototype.loop = function(ts) {

    // Restrict refresh rate
    const MAX_UPDATES = 5;

    // Make sure delta time does not
    // jump too much
    if(this.oldTime < 0)
        this.oldTime = ts;

    // Update time sum if assets are loaded
    let target = 1.0 / this.framerate;
    let delta = ts - this.oldTime;
    //if(this.ass.hasLoaded())
    this.timeSum += delta / 1000.0;

    // If enough time has passed, update frame
    let updateCount = 0;
    let redraw = false;
    while(this.timeSum >= target) {
         
        // Enable re-drawing the frame
        redraw = true;

        // Update frame
        this.update(target)

        // Update time sum
        this.timeSum -= target;

        // Check if update count does not go 
        // too big
        if(++ updateCount >= MAX_UPDATES) {

            this.timeSum = 0.0;
            break;
        }
    }

    // (Re)draw the scene
    if(redraw) {

        this.draw();
    }

    // Next frame
    window.requestAnimationFrame( (ts) => this.loop(ts) );
}


// Run
Core.prototype.run = function(fps) {

    // Initialize
    this.framerate = fps ? fps : 30;
    this.init();

    // Enter the loop
    window.requestAnimationFrame( (ts) => this.loop(ts) );
}
