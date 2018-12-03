import Constants from '../shared/constants';
import ProgressState from '../shared/model/progressState';

class NetflixController {

    constructor () {
        console.log('<Info> Starting controller...');
        this._start();
        this._get_video().on('play', this.play);
        this._get_video().on('pause', this.pause);
        this.playerState = Constants.Codes.ControllerState.IDLE;
        this.progressState = new ProgressState();
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
        // Sync controller state
        if (this._get_video()) {
            if (this._get_video().paused == true) this.playerState = Constants.Codes.ControllerState.PAUSE;
            else this.playerState = Constants.Codes.ControllerState.PLAY;
        } else this.playerState = Constants.Codes.ControllerState.IDLE;
        // Sync progress state
    }
}

const controller = new NetflixController();