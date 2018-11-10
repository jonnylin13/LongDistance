class NetflixController {

    constructor() {
        this._start();
        this._get_video().on('play', this.play);
        this._get_video().on('pause', this.pause);
        this.state = 0;
        this.sync();
    }

    _start() {
        
    }

    _get_video() {
        return $('video');
    }

    _get_play() {
        return $('.button-nfplayerPlay');
    }

    _get_player() {
        return $('.nf-player-container');
    }

    _get_pause() {
        return $('.button-nfplayerPause');
    }

    _get_scrubber() {
        return $('.scrubber-bar');
    }

    play() {

    }

    pause() {

    }

    sync() {
        if (this._get_video()[0]) {
            if (this._get_video()[0].paused == true) this.state = 0;
            else this.state = 1;
        } else this.state = -1;
    }
}

const controller = new NetflixController();