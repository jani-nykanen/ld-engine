//
// LDEngine 
// A simple transition manager
// (c) 2019 Jani Nykänen
//

// Initialize transition time
const INITIAL_TRANSITION_TIME = 60;


// Fade mode flag
let Fade = {

    In: 0,
    Out: 1,
};
// Transition effect
let Effect = {
    Fading: 0,
    HBars: 1,
    VBars: 2,
    Bars: 3
};


// Constructor
let Transition = function() {

    this.timer = 0;
    this.speed = 1;
    this.color = {r: 0, g: 0, b: 0};
    this.active = false;
    this.effect = 0;
    this.division = -1;
    this.cb = null;
}


// Activate
Transition.prototype.activate = function(mode, speed, cb, color, div, eff) {

    this.mode = mode;
    this.speed = speed;
    this.cb = cb;
    this.active = true;
    this.timer = INITIAL_TRANSITION_TIME;
    this.division = (div == null) ? -1 : div;
    this.effect = eff == null ? Effect.Fading : eff;

    if(color != null) {

        this.color = color;
    }
    else {

        this.color.r = 0;
        this.color.g = 0;
        this.color.b = 0;
    }

}


// Update
Transition.prototype.update = function(tm) {

    if(!this.active) return;

    // Update timer
    this.timer -= this.speed * tm;
    if(this.timer <= 0.0) {

        if(this.mode == Fade.In) {

            if(this.cb != null)
                this.cb();

            this.mode = Fade.Out;
            this.timer += INITIAL_TRANSITION_TIME;
        }
        else {

            this.active = false;
        }
    }
}


// Draw
Transition.prototype.draw = function(g) {

    if(!this.active) return;

    let w = g.canvas.width;
    let h = g.canvas.height;

    let alpha = this.timer / INITIAL_TRANSITION_TIME;
    if(this.mode == Fade.In)
        alpha = 1.0 - alpha;

    // In some cases we don't want a smooth transition
    if(this.division > 0)
        alpha = ((alpha*this.division)|0) / this.division;

    this.color.a = 1.0;
    let th = (alpha * g.canvas.height/2) | 0;
    let tw = (alpha * g.canvas.width/2) | 0;

    switch(this.effect) {

    case Effect.Fading:
        // Fill screen
        this.color.a = alpha;
        g.fillRect(0, 0, w, h, this.color);  
        break;
    
    case Effect.VBars:
    {
        g.fillRect(0, 0, g.canvas.width, th, this.color);
        g.fillRect(0, g.canvas.height-th, g.canvas.width, th, this.color);
        break;
    }

    case Effect.HBars:
    {
        g.fillRect(0, 0, tw, g.canvas.height, this.color);
        g.fillRect(g.canvas.width-tw, 0, tw, g.canvas.height, this.color);
        break;
    }

    case Effect.Bars:
    {
        g.fillRect(0, 0, g.canvas.width, th, this.color);
        g.fillRect(0, g.canvas.height-th, g.canvas.width, th, this.color);
        g.fillRect(0, 0, tw, g.canvas.height, this.color);
        g.fillRect(g.canvas.width-tw, 0, tw, g.canvas.height, this.color);
        break;
    }

    default:
        break;
    }    
}
