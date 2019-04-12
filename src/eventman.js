//
// LDEngine
// Event manager
// (c) 2019 Jani Nykänen


// Constructor
let EventManager = function(core, audio, sounds, vpad, transition) {

    // Store references to components
    this.core = core;
    this.audio = audio;
    this.sounds = sounds;
    this.vpad = vpad;
    this.transition = transition;
}


// Change scene
EventManager.prototype.changeScene = function(name, param) {

    this.core.changeScene(name, param);
}
