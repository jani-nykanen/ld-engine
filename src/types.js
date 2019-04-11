//
// LDEngine
// Auxiliary types
// (c) 2019 Jani Nykänen
//

// Vector type
let Vec2 = function(x, y) {

    this.x = x != null ? x : 0;
    this.y = y != null ? y : 0;
}


// Operations
Vec2.prototype.addVec2 = function(v) {

    return new Vec2(this.x + v.x, this.y + v.y);
}
Vec2.prototype.add = function(x, y) {

    return new Vec2(this.x + x, this.y + y);
}
