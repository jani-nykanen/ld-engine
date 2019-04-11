// A template main file
// (c) Insert your name here


// The main function
let main = function() {

    // Assets
    let assetContent = {

        // Fill this
    }

    // Gamepad config
    let gamepadConfig = {

        // Fill this
    }
    // Derired framerate
    let framerate = 30;


    // Create application core
    let c = new Core();

    // Add scenes
    c.addScene(new Game(), true);
    // Add more scenes here

    // Run application
    c.run(framerate, assetContent, gamepadConfig);
}
