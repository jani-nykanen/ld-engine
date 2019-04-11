//
// LDEngine
// Event manager
// (c) 2019 Jani Nykänen


// Constructor
let EventManager = function(core, audio, sounds, vpad) {

    // Store references to components
    this.core = core;
    this.audio = audio;
    this.sounds = sounds;
    this.vpad = vpad;
}


// Change scene
EventManager.prototype.changeScene = function(name, param) {

    this.core.changeScene(name, param);
}
