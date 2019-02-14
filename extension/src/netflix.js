class VideoState {

}

class NetflixState {

}

class NetflixController {

    constructor() {
        console.log('<LDN> Starting controller...');

    }

    getVideo() {
        return document.getElementsByTagName('video')[0];
    }

    getPlayButton() {
        return document.getElementsByClassName('.button-nfplayerPlay')[0];
    }

    getPlayerContainer() {
        return document.getElementsByClassName('.nf-player-container')[0];
    }

    getPauseButton() {
        return document.getElementsByClassName('.button-nfplayerPause')[0];
    }

    getScrubber() {
        return document.getElementsByClassName('.scrubber-bar')[0];
    }
}

const controller = new NetflixController();