//
// LDEngine
// Audio player
// (c) 2019 Jani Nykänen
//


// Constructor
let AudioPlayer = function() {

    this.enabled = true;

    // Volume
    this.sampleVol = 1.0;
    this.musicVol = 1.0;

    // Music ID
    this.musicID = null;
    // Music sound
    this.musicSound = null;
    // Volume "cache"
    this.volCache = 0.0;
}


// Toggle audio
AudioPlayer.prototype.toggle = function(state) {

    this.enabled = state;
    
    if(!state) {

        if(this.musicSound != null && this.musicID != null)
            this.musicSound.volume(0.0, this.musicID);
    }
    else {

        if(this.musicSound != null && this.musicID != null)
            this.musicSound.volume(this.volCache, this.musicID);
    }
}


// Fade in music
AudioPlayer.prototype.fadeInMusic = function(sound, vol, time) {

    if(this.musicID == null) {

        this.musicID = sound.play();
        this.musicSound = sound;
    }

    this.volCache = vol * this.musicVol;

    sound.volume(vol * this.musicVol, sound);
    sound.loop(true, this.musicID);
    if(!this.enabled) vol = 0.0;
    sound.fade(0.0, vol, time, this.musicID);
}

// Fade out music
AudioPlayer.prototype.fadeOutMusic = function(sound, vol, time) {

    if(this.musicID == null) {

        this.musicID = sound.play();
        this.musicSound = sound;
    }

    sound.volume(vol * this.musicVol, sound);
    sound.loop(true, this.musicID);
    if(!this.enabled) vol = 0.0;
    sound.fade(vol, 0.0, time, this.musicID);
}


// Pause music
AudioPlayer.prototype.stopMusic = function() {

    if(this.musicSound == null || this.musicID == null)
        return;

    this.musicSound.stop(this.musicID);
    this.musicID = null;
    this.musicSound = null;
}


// Pause music
AudioPlayer.prototype.pauseMusic = function() {

    if(this.musicSound == null || this.musicID == null)
        return;

    this.musicSound.pause(this.musicID);
}


// Resume music
AudioPlayer.prototype.resumeMusic = function() {

    this.musicSound.play(this.musicID);
}


// Play a sample
AudioPlayer.prototype.playSample = function(sound, vol) {

    if(!this.enabled) return;

    vol *= this.sampleVol;

    if(!sound.playID) {

        sound.playID = sound.play();

        sound.volume(vol, sound.playID );
        sound.loop(false, sound.playID );
    }
    else {

        sound.stop(sound.playID);
        sound.volume(vol, sound.playID );
        sound.loop(false, sound.playID );
        sound.play(sound.playID);
    }
}
