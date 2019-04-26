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
let GraphicsCore = function(bitmaps) {

    // Get canvas & context
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;

    // Canvas position & size
    this.cpos = new Vec2();
    this.csize = new Vec2();

    // Resize canvas now
    this.resize(window.innerWidth, window.innerHeight);

    // Reference to bitmaps
    this.bitmaps = bitmaps;
    
    // Translation
    this.tr = new Vec2(0, 0);
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

    // Store position & size
    this.cpos.x = x;
    this.cpos.y = y;
    this.csize.x = width;
    this.csize.y = height;
    
    // Set style properties
    let top = String(y | 0) + "px";
    let left = String(x | 0) + "px";
    c.style.height = String(height | 0) + "px";
    c.style.width = String(width | 0) + "px";
    c.style.top = top;
    c.style.left = left;
}


// Set global alpha
GraphicsCore.prototype.setGlobalAlpha = function(a) {

    if(a == null) a = 1.0;
    this.ctx.globalAlpha = a;
}


// Clear screen
GraphicsCore.prototype.clear = function(r, g, b) {

    let c = this.ctx;

    c.fillStyle = this.getColorString(r, g, b);
    c.fillRect(0, 0, this.canvas.width, this.canvas.height);
}


// Draw a bitmap
GraphicsCore.prototype.drawBitmap = 
    function (bmp, x, y, flip) {

    this.drawBitmapRegion(bmp, 0, 0, bmp.width, bmp.height, 
        x, y, flip);
}


// Draw a scaled bitmap
GraphicsCore.prototype.drawScaledBitmap = 
    function (bmp, dx, dy, dw, dh,  flip) {

    this.drawScaledBitmapRegion(bmp, 0, 0, bmp.width, bmp.height, 
            dx, dy, dw, dh, flip);
}


// Draw a bitmap region
GraphicsCore.prototype.drawBitmapRegion = 
    function (bmp, sx, sy, sw, sh, dx, dy, flip) {

    this.drawScaledBitmapRegion(bmp, sx, sy, sw, sh, 
        dx, dy, sw, sh, flip);
}



// Draw a scaled bitmap region
GraphicsCore.prototype.drawScaledBitmapRegion = 
    function (bmp, sx, sy, sw, sh, 
                   dx, dy, dw, dh, 
                   flip) {

    if(dw <= 0 || dh <= 0 || sw <= 0 || sh <= 0) 
        return;
        
    // Apply translation
    dx += this.tr.x;
    dy += this.tr.y;

    // Only integer positions etc. are
    // allowed
    sx |= 0;
    sy |= 0;
    sw |= 0;
    sh |= 0;

    dx |= 0;
    dy |= 0;
    dw |= 0;
    dh |= 0;

    flip = flip | Flip.None;
    let c = this.ctx;

    // If flipping, save the current transformations
    // state
    if (flip != Flip.None) {
        c.save();
    }

    // Flip horizontally
    if ((flip & Flip.Horizontal) != 0) {

        c.translate(dw, 0);
        c.scale(-1, 1);
        dx *= -1;
    }
    // Flip vertically
    if ((flip & Flip.Vertical) != 0) {

        c.translate(0, dh);
        c.scale(1, -1);
        dy *= -1;
    }

    c.drawImage(bmp, sx, sy, sw, sh, dx, dy, dw, dh);

    // ... and restore the old
    if (flip != Flip.None) {

        c.restore();
    }
}


// Draw text
GraphicsCore.prototype.drawText = function (bmp, text, dx, dy, xoff, yoff, center) {

    let cw = bmp.width / 16;
    let ch = cw;
    let len = text.length;
    let x = dx;
    let y = dy;
    let c = 0;

    let sx = 0;
    let sy = 0;

    // Center the text
    if (center) {

        dx -= ((len) / 2.0 * (cw + xoff));
        x = dx;
    }

    // Draw every character
    for (let i = 0; i < len; ++i) {

        c = text.charCodeAt(i);
        // Newline
        if (text[i] == '\n') {

            x = dx;
            y += yoff + ch;
            continue;
        }

        sx = c % 16;
        sy = (c / 16) | 0;

        // Draw character
        this.drawBitmapRegion(bmp, sx * cw, sy * ch, cw, ch,
            x, y,
            Flip.NONE);

        x += cw + xoff;
    }
}


// Draw a filled rectangle
GraphicsCore.prototype.fillRect = function (x, y, w, h, col) {

    let c = this.ctx;
    // Set color, if given
    if(col != null) {

        c.fillStyle = this.getColorString(col.r, col.g, col.b, col.a);
    }
    
    // Apply translation
    x += this.tr.x;
    y += this.tr.y;

    // Draw the rectangle
    c.fillRect(x | 0, y | 0, w | 0, h | 0);
}


// Set translation
GraphicsCore.prototype.setTranslation = function(x, y) {

    if(x == null) x = 0;
    if(y == null) y = 0;

    this.tr.x = x;
    this.tr.y = y;
}


// Translate
GraphicsCore.prototype.translate = function(x, y) {

    this.tr.x += x;
    this.tr.y += y;
}

