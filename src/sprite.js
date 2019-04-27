//
// LDEngine 
// Animated sprite
// (c) 2019 Jani Nykänen
//


// Constructor
let AnimatedSprite = function (w, h) {

    // Dimensions
    this.width = w;
    this.height = h;

    this.frame = 0;
    this.row = 0;
    this.count = 0.0;
}


// Animate
AnimatedSprite.prototype.animate = function (row, start, end, speed, tm) {

    // Nothing to animate
    if (start == end) {

        this.count = 0;
        this.frame = start;
        this.row = row;
        return;
    }

    // Swap row
    if (this.row != row) {

        this.count = 0;
        this.frame = end > start ? start : end;
        this.row = row;
    }

    // If outside the animation interval
    if (start < end && this.frame < start) {

        this.frame = start;
    }
    else if (end < start && this.frame < end) {

        this.frame = end;
    }

    // Animate
    this.count += 1.0 * tm;
    if (this.count > speed) {

        if (start < end) {

            if (++this.frame > end) {

                this.frame = start;
            }
        }
        else {

            if (--this.frame < end) {

                this.frame = start;
            }
        }

        this.count -= speed;
    }
}


// Draw frame
AnimatedSprite.prototype.drawFrame = function (g, bmp, 
    frame, row, dx, dy, flip) {

    g.drawBitmapRegion(bmp, this.width * frame,
        this.height * row, this.width, this.height, dx, dy, flip);
}



// Draw
AnimatedSprite.prototype.draw = function (g, bmp, dx, dy, flip) {

    this.drawFrame(g, bmp, this.frame, this.row, dx, dy, flip);
}


// Draw scale
AnimatedSprite.prototype.drawScaled = function (g, bmp, dx, dy, dw, dh, flip) {

    g.drawScaledBitmapRegion(bmp, this.width * this.frame,
        this.height * this.row, this.width, this.height, dx, dy, dw, dh, flip);
}
