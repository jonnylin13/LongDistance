class NetflixController {

    constructor () {
        console.log('<Info> Starting controller...');
        this._start();
        this._get_video().on('play', this.play);
        this._get_video().on('pause', this.pause);
        this.state = 0;
        this.sync();
        console.log('<Info> Controller has been started!');
    }

    _start () {
        
    }

    _get_video () {
        return $('video');
    }

    _get_play () {
        return $('.button-nfplayerPlay')[0];
    }

    _get_player () {
        return $('.nf-player-container')[0];
    }

    _get_pause () {
        return $('.button-nfplayerPause')[0];
    }

    _get_scrubber () {
        return $('.scrubber-bar')[0];
    }

    play () {

    }

    pause () {

    }

    sync () {
        if (this._get_video()) {
            if (this._get_video().paused == true) this.state = 0;
            else this.state = 1;
        } else this.state = -1;
    }
}

const controller = new NetflixController();