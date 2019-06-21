//
// LDEngine 
// Input manager
// (c) 2019 Jani Nykänen
//


// Key states
let State = {
    Up : 0,
    Down : 1,
    Pressed : 2,
    Released : 3,
};


// Constructor
let InputManager = function (g) {

    // This should be enough
    const KEY_STATE_MAX = 256;
    const MOUSE_STATE_MAX = 3;

    // Set callback functions
    window.addEventListener("keydown", (e) => {
        e.preventDefault();
        this.keyPressed(e.keyCode);
    });
    window.addEventListener("keyup", (e) => {
        e.preventDefault();
        this.keyReleased(e.keyCode);
    });

    // Mouse down
    window.addEventListener("mousedown", (e) => {
        window.focus();
        e.preventDefault();
        this.mouseButtonPressed(e.button, e.clientX, e.clientY);
    });
    // Mouse up
    window.addEventListener("mouseup", (e) => {
        e.preventDefault();
        this.mouseButtonReleased(e.button);
    });
    // Mouse move
    window.addEventListener("mousemove", (e) => {

        window.focus(); // TODO: Possibly remove?
        this.mouseMove(e.clientX, e.clientY);
    });

    // Touch start
    window.addEventListener("touchstart", (e) => {

        e.preventDefault();
        this.mouseButtonPressed(0, 
            e.touches[0].clientX, 
            e.touches[0].clientY);
        this.mouseMove(e.touches[0].clientX, 
            e.touches[0].clientY);
    },{ passive: false });
    // Touch end
    window.addEventListener("touchend", (e) => {

        e.preventDefault();
        this.mouseButtonReleased(0);
    },{ passive: false });
    // Touch cancle
    window.addEventListener("touchcancel", (e) => {
    
        if (e.cancelable) {
            e.preventDefault(); 
        }
        this.mouseButtonReleased(0);
    },{ passive: false });
    // Touch move
    window.addEventListener("touchmove", (e) => {

        e.preventDefault();
        this.mouseMove(e.touches[0].clientX, 
            e.touches[0].clientY);
    },{ passive: false });

    // Initialize key & mouse states
    this.keyStates = new Array(KEY_STATE_MAX);
    for(let i = 0; i < this.keyStates.length; ++ i) {

        this.keyStates[i] = State.Up;
    }
    this.mouseStates = new Array(MOUSE_STATE_MAX);
    for(let i = 0; i < this.mouseStates.length; ++ i) {

        this.mouseStates[i] = State.Up;
    }

    // Mouse position data (w.r.t the canvas)
    this.mousePos = new Vec2();
    // Touch info (also for mouse, when the left button down)
    this.touchPos = this.mousePos;
    this.oldTouchPos = new Vec2();
    this.touchStart = new Vec2();
    this.touchDelta = new Vec2();
    this.touchDirection = new Vec2();
    this.touchDistance = 0;
    this.touchDown = false;

    // If any key was pressed during
    // the latest frame
    this.anyKeyPressed = false;

    // Reference to graphics
    this.g = g;
}


// Key pressed event
InputManager.prototype.eventPressed = function (arr, key, cb) {

    if(key < 0 || key >= arr.length 
        || arr[key] == State.Down)
        return;

        arr[key] = State.Pressed;
    if(cb != null) {

        cb(key);
    }
}


// Key released event
InputManager.prototype.eventReleased = function (arr, key) {

    if(key < 0 || key >= arr.length 
        || arr[key] == State.Up)
        return;

    arr[key] = State.Released;
}


// Update a state array
InputManager.prototype.updateStateArray = function(arr) {

    for(let i = 0; i < arr.length; ++ i) {

        if(arr[i] == State.Pressed) {

            arr[i] = State.Down;
        }
        else if(arr[i] == State.Released) {

            arr[i] = State.Up;
        }
    }
}


// Key pressed event
InputManager.prototype.keyPressed = function (key) {

    this.eventPressed(this.keyStates, key, () => 
        {this.anyKeyPressed = true;}
    );
}


// Key released event
InputManager.prototype.keyReleased = function (key) {

    this.eventReleased(this.keyStates, key);
}


// Mouse button pressed event
InputManager.prototype.mouseButtonPressed = function (b, x, y) {

    this.eventPressed(this.mouseStates, b);
    
    if(b == 0) {
    
        x -= this.g.cpos.x;
        y -= this.g.cpos.y;

        this.touchStart.x = (x / this.g.csize.x) * this.g.canvas.width;
        this.touchStart.y = (y / this.g.csize.y) * this.g.canvas.height;
        this.touchDown = true;
    }
}


// Mouse button released event
InputManager.prototype.mouseButtonReleased = function (b) {

    this.eventReleased(this.mouseStates, b);
    if(b == 0) {

        this.touchDown = false;
    }
}


// Mouse move
InputManager.prototype.mouseMove = function(x, y) {

    x -= this.g.cpos.x;
    y -= this.g.cpos.y;

    this.mousePos.x = (x / this.g.csize.x) * this.g.canvas.width;
    this.mousePos.y = (y / this.g.csize.y) * this.g.canvas.height;
}


// Update input manager
InputManager.prototype.update = function() {

    const EPS = 0.01;

    this.anyKeyPressed = false;

    // Update states
    this.updateStateArray(this.keyStates);
    this.updateStateArray(this.mouseStates);

    // Compute touch distance
    if(this.touchDown) {

        this.touchDistance = Math.hypot(
            this.touchPos.x-this.touchStart.x,
            this.touchPos.y-this.touchStart.y);
    }
    else {

        this.touchDistance = 0.0;
    }   

    // Compute touch delta
    this.touchDelta.x = this.touchPos.x-this.oldTouchPos.x;
    this.touchDelta.y = this.touchPos.y-this.oldTouchPos.y;

    // Compute direction
    if(this.touchDistance > EPS) {

        this.touchDirection.x = this.touchPos.x-this.touchStart.x;
        this.touchDirection.y = this.touchPos.y-this.touchStart.y;

        this.touchDirection.x /= this.touchDistance;
        this.touchDirection.y /= this.touchDistance;
    }
    else {
        
        this.touchDirection.x = 0;
        this.touchDirection.y = 0;
    }

    this.oldTouchPos = this.touchPos.copy();
}


// Get a key state
InputManager.prototype.getKey = function(key) {

    if(key < 0 || key >= this.keyStates.length)
        return State.Up;

    return this.keyStates[key];
}


// Get a mouse button state
InputManager.prototype.getMouseButton = function(b) {

    if(b < 0 || b >= this.mouseStates.length)
        return State.Up;

    return this.mouseStates[b];
}
