//
// LDEngine 
// Graphics core
// (c) 2019 Jani Nykänen
//


// Flipping flags
let Flip = {
    None: 0,
    Horizontal: 1,
    Vertical: 2,
    Both: 3
};


// Constructor
let GraphicsCore = function() {

    // Get canvas & context
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;

    // Resize canvas now
    this.resize(window.innerWidth, window.innerHeight);
}


// Convert RGBA color to a string format
GraphicsCore.prototype.getColorString = function(r, g, b, a) {

    if (a == null) 
        a = 1.0;
    
    return "rgba("
        + String(r | 0) + ","
        + String(g | 0) + ","
        + String(b | 0) + ","
         + String(a) + ")";
}


// Resize
GraphicsCore.prototype.resize = function(w, h) {

    let c = this.canvas;

    // Find the best multiplier for
    // square pixels
    let hratio = (w / c.width) | 0;
    let vratio = (h / c.height) | 0;
    let mul = Math.min(hratio, vratio);
    
    // Compute properties
    let width, height, x, y;
    width = c.width * mul;
    height = c.height * mul;
    x = w/2 - width/2;
    y = h/2 - height/2;
    
    // Set style properties
    let top = String(y | 0) + "px";
    let left = String(x | 0) + "px";
    c.style.height = String(height | 0) + "px";
    c.style.width = String(width | 0) + "px";
    c.style.top = top;
    c.style.left = left;
}


// Clear screen
GraphicsCore.prototype.clear = function(r, g, b) {

    let c = this.ctx;

    c.fillStyle = this.getColorString(r, g, b);
    c.fillRect(0, 0, this.canvas.width, this.canvas.height);
}
