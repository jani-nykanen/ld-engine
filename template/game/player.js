// A player object
// (c) Insert name here


// Constructor
let Player = function(x, y) {

    const DEFAUL_ACC = 0.15;

    // Position
    this.pos = new Vec2(x, y);

    // Speed
    this.speed = new Vec2();
    this.target = new Vec2();

    // Acceleration
    this.acc = new Vec2(DEFAUL_ACC, DEFAUL_ACC);

    // Hitbox
    this.width = 16;
    this.height = 16;
}


// Update speed
Player.prototype.updateSpeed = function(speed, target, acc, tm)  {
    
    if (speed < target) {

        speed += acc * tm;
        if (speed > target) {

            speed = target;
        }
    }
    else if (speed > target) {

        speed -= acc * tm;
        if (speed < target) {

            speed = target;
        }
    }

    return speed;
}


// Control
Player.prototype.control = function(evMan, tm) {
    
    const EPS = 1.0;

    let stick = evMan.vpad.stick;
    let l = Math.hypot(stick.x, stick.y);
    if(l > EPS) {

        stick.x /= l;
        stick.y /= l;
    }

    this.target.x = stick.x *2;
    this.target.y = stick.y *2;
}


// Move
Player.prototype.move = function(evMan, tm) {

    // Update speed axes
    this.speed.x =
        this.updateSpeed(this.speed.x, this.target.x, 
        this.acc.x, tm);
    this.speed.y =
        this.updateSpeed(this.speed.y, this.target.y, 
        this.acc.y, tm);

    // Update position
    this.pos.x += this.speed.x * tm;
    this.pos.y += this.speed.y * tm;
}


// Animate
Player.prototype.animate = function(evMan, tm) {

    // ...
}


// Update
Player.prototype.update = function(evMan, cam, tm) {

    this.control(evMan, tm);
    this.move(evMan, tm);
    this.animate(evMan, tm);
}


// Draw
Player.prototype.draw = function(g) {

    g.fillRect(this.pos.x-this.width/2, this.pos.y-this.height/2,
            this.width, this.height, {r: 255, g: 0, b: 0});
}
