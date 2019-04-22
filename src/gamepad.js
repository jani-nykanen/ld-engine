// 
// LDEngine
// A (virtual) gamepad
// (c) 2019 Jani Nykänen
//


// Constructor
let Vpad = function(input, config) {

    // Reference to the input manager
    this.input = input;

    // "Analogue" stick
    this.stick = new Vec2();
    // Old stick state
    this.oldStick = this.stick.copy();
    // Stick delta
    this.stickDelta = new Vec2();

    // Buttons
    this.buttons = {};
    if(config != null) {

        // Set buttons
        for(let k in config.buttons) {

            this.buttons[k] = {

                key: config.buttons[k],
                state: State.Up
            }
        }
    }
}


// Update
Vpad.prototype.update = function() {

    // const EPS = 0.01;

    // Store old stick state
    this.oldStick.x = this.stick.x;
    this.oldStick.y = this.stick.y;

    // Set current state to zero
    this.stick.x = 0;
    this.stick.y = 0;

    // Left
    if(this.input.getKey(37) == State.Down) {

        this.stick.x = -1.0;
    }
    // Right
    else if(this.input.getKey(39) == State.Down) {

        this.stick.x = 1.0;
    }

    // Up
    if(this.input.getKey(38) == State.Down) {

        this.stick.y = -1.0;
    }
    // Down
    else if(this.input.getKey(40) == State.Down) {

        this.stick.y = 1.0;
    }

    // Restrict values to a unit sphere (and 0)
    // this.len = Math.hypot(this.stick.x, this.stick.y);
    // if(this.len > EPS) {
    //
    //    this.stick.x /= this.len;
    //    this.stick.y /= this.len;
    // }

    // Calculate delta
    this.stickDelta.x = this.stick.x - this.oldStick.x;
    this.stickDelta.y = this.stick.y - this.oldStick.y;

    // Update buttons
    for(k in this.buttons) {

        this.buttons[k].state = 
            this.input.getKey(this.buttons[k].key);
    }
}


