// A temporary main file, for production only


// Test scene
let TestScene = function() {

    this.name = "test";

    // Test position
    this.testPos = new Vec2(80, 72);
}


// Initialize
TestScene.prototype.init = function() {

}


// On load
TestScene.prototype.onLoad = function(assets) {

    console.log(assets.documents.test);
}


// Update
TestScene.prototype.update = function(evMan, tm) {

    this.testPos.x += evMan.vpad.stick.x  * tm;
    this.testPos.y += evMan.vpad.stick.y  * tm;
}


// Draw
TestScene.prototype.draw = function(g) {

    g.clear(170, 170, 170);

    g.fillRect(this.testPos.x-16, this.testPos.y-16, 32, 32, {r: 255, g : 0, b: 0});
}


// Asset content
let assetsContent = {

    docPath: "./",
    documents: {

        test: "test.xml",
    }
}


// Main function
function main() {

    let c = new Core;

    // Add scenes
    c.addScene(new TestScene(), true);

    // Run
    c.run(60, assetsContent);
}
