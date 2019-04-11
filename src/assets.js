//
// LDEngine 
// Asset pack
// (c) 2019 Jani Nykänen
//


// Constructor
let AssetPack = function(content) {

    // How many files loaded
    this.loaded = 0;
    // File total
    this.total = 0;
    
    // Assets
    this.bitmaps = {};
    this.audio = {};

    // If something to load, load
    if(content != null) {

        // Set bitmaps to be loaded
        for(let k in content.bitmaps) {

            this.loadBitmap(k, 
                content.bitmapPath + "/" + content.bitmaps[k]);
        }

        // Set sounds to be loaded
        for(let k in content.soundList) {

            this.loadSound(k, 
                content.soundPath + "/" + content.sounds[k]);
        }

    }
}


// Load a bitmap
AssetPack.prototype.loadBitmap = function(name, url) {

    ++ this.total;

    let image = new Image();
    image.onload = () => {++this.loaded;}
    image.src = url;
    this.bitmaps[name] = image;
}


// Load a sound
AssetPack.prototype.loadSound = function(name, url) {

    ++ this.total;

    this.audio[name] = new Howl({
        src: [url],
        onload: () => {++this.loaded;}
    });
}


// Are all the assets loaded
AssetPack.prototype.hasLoaded = function() {

    return this.total == 0 || this.loaded >= this.total;
}


// Get the amount of loaded assets in [0,1] range
AssetPack.prototype.getPercentage = function() {

    if(this.total == 0) return 0.0;
    return this.loaded / this.total;
}
