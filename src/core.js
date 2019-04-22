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
    this.globalScene = null;

    // Framerate (default is 30)
    // Affects only the game logic
    this.framerate = 30;

    // Old timestamp & time sum
    this.oldTime = -1;
    this.timeSum = 0;

    // If "onLoad" is called
    this.onLoadCalled = false;
}


// Initialize
Core.prototype.init = function(assetContent, padConfig) {

    // Set assets loading
    this.assets = new AssetPack(assetContent);

    // Create components
    this.graphics = new GraphicsCore(this.assets.bitmaps);
    this.input = new InputManager();
    this.audio = new AudioPlayer();
    this.vpad = new Vpad(this.input, padConfig);
    this.tr = new Transition();
    this.evMan = new EventManager(this, 
        this.audio, this.assets.audio, 
        this.vpad, this.tr);

    // Set default listeners
    window.addEventListener("resize", () => {
        this.graphics.resize(window.innerWidth, 
                             window.innerHeight);
        }
    );

    // Initialize scenes
    let s;
    for(let i = 0; i < this.scenes.length; ++ i) {

        s = this.scenes[i];
        if(s.init != null) {

            s.init(this.evMan);
        }
    }
}


// Update
Core.prototype.update = function(delta) {

    // We compare delta time to this "target
    // framerate"
    const COMPARED_FRAMERATE = 60;

    // Calculate time multiplier
    let tm = delta / (1.0/COMPARED_FRAMERATE);

    // Update the active scene
    if(this.activeScene != null &&
       this.activeScene.update != null) {

        this.activeScene.update(this.evMan, tm);
    }

    // Update the global scene
    if(this.globalScene != null &&
        this.globalScene.update != null) {
 
         this.globalScene.update(this.evMan, tm);
     }

    // Update input
    this.vpad.update();
    this.input.update();

    // Update transition
    this.tr.update(tm);
}


// Draw loading screen
Core.prototype.drawLoadingScreen = function() {

    let barWidth = this.graphics.canvas.width / 4;
    let barHeight = barWidth / 8;

    // Black background
    this.graphics.clear(0, 0, 0);

    let t = this.assets.getPercentage();
    let x = this.graphics.canvas.width/2-barWidth/2;
    let y = this.graphics.canvas.height/2-barHeight/2;

    // Draw outlines
    this.graphics.fillRect(x-2, y-2, barWidth+4, barHeight+4,
        {r: 255, g: 255, b: 255});
        this.graphics.fillRect(x-1, y-1, barWidth+2, barHeight+2,
        {r: 0, g: 0, b: 0});

    // Draw bar
    let w = (barWidth*t) | 0;
    this.graphics.fillRect(x, y, w, barHeight,
        {r: 255, g: 255, b: 255});
}


// Draw
Core.prototype.draw = function() {

    // Draw the active scene
    if(this.activeScene != null &&
        this.activeScene.draw != null) {
 
         this.activeScene.draw(this.graphics);
    }

    // Draw the global scene
    if(this.globalScene != null &&
        this.globalScene.draw != null) {
 
        this.globalScene.draw(this.graphics);
    }

    // Draw transition
    this.tr.draw(this.graphics);
}


// "On load" event
Core.prototype.onLoad = function() {

    let s;
    for(let i = 0; i < this.scenes.length; ++ i) {

        s = this.scenes[i];
        if(s.onLoad != null) {

            s.onLoad(this.assets);
        }
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
    if(this.assets.hasLoaded()) {

        // Update time sum
        this.timeSum += delta / 1000.0;

        // Call "onLoad" to scenes
        if(!this.onLoadCalled) {

            this.onLoad();
            this.onLoadCalled = true;
        }
    }

    // If enough time has passed, update frame
    let updateCount = 0;
    let redraw = false;
    while(this.assets.hasLoaded() &&
          this.timeSum >= target) {
         
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
    if(this.assets.hasLoaded()) {

        if(redraw) {

            this.draw();
        }
    }
    else {
        
        // Draw loading screen
        this.drawLoadingScreen();
    }

    // Store old time
    this.oldTime = ts;

    // Next frame
    window.requestAnimationFrame( (ts) => this.loop(ts) );
}


// Run
Core.prototype.run = function(fps, assetContent, padConfig) {

    // Initialize
    this.framerate = fps == null ? 30 : fps;
    this.init(assetContent, padConfig);

    // Enter the loop
    window.requestAnimationFrame( (ts) => this.loop(ts) );
}


// Change scene
Core.prototype.changeScene = function(name, param) {

    // Find a corresponding scene
    for(let i = 0; i < this.scenes.length; ++ i) {

        if(this.scenes[i].name == name) {

            this.activeScene = this.scenes[i];
            if(this.activeScene.onChange != null) {

                this.activeScene.onChange(param);
                return;
            }
        }
    }
}


// Add a scene
Core.prototype.addScene = function(scene, makeActive, makeGlobal) {

    this.scenes.push(scene);
    if(makeActive) {

        this.activeScene = scene;
    }
    if(makeGlobal) {

        this.globalScene = scene;
    }
}
