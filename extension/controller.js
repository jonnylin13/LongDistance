import Constants from '../shared/constants';
import ProgressState from '../shared/model/progressState';

// NOT PERSISTENT
// Essential help
// https://stackoverflow.com/questions/41985502/how-to-interact-with-netflix-cadmium-video-player-on-the-client
// https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver

class NetflixController {
  constructor() {
    this.ready = false;
    this.progressState = new ProgressState();

    // Messages from ldn.js and postMessage
    window.addEventListener('message', event => {
      this.onMessage(event.data);
    });

    const observer = new MutationObserver((mutations, observer) => {
      mutations.forEach(mutation => {
        if (mutation.target.className === 'VideoContainer') {
          // DO something
          this.videoPlayer = netflix.appContext.state.playerApp.getAPI().videoPlayer;
          this.sessionId = this.videoPlayer.getAllPlayerSessionIds()[0];
          this.player = this.videoPlayer.getVideoPlayerBySessionId(
            this.sessionId
          );
          this.getVP().addEventListener('play', event => this.userPlay(event));
          this.getVP().addEventListener('pause', event =>
            this.userPause(event)
          );
          this.getVP().addEventListener('timeupdate', event =>
            this.timeUpdate(event)
          );
          this.getVP().addEventListener('seeked', event =>
            this.userSeek(event)
          );
          /** this.getVP().on('play', event => this.userPlay(event));
          this.getVP().on('pause', event => this.userPause(event));
          this.getVP().on('timeupdate', event => this.timeUpdate(event));
          this.getVP().on('seeked', event => this.userSeek(event));*/

          console.log('<Controller> Script started!');
          observer.disconnect();
        }
      });
    });

    observer.observe(document.getElementById('appMountPoint'), {
      childList: true,
      subtree: true
    });
  }

  // ===============
  // Private Methods
  // ===============

  getVP() {
    return document.getElementsByTagName('video')[0];
  }

  stateUpdate(_controllerState) {
    const req = {
      type: Constants.Protocol.Messages.UPDATE_STATE,
      controllerState: _controllerState
    };
    window.postMessage(req);
  }

  // ==============
  // Public Methods
  // ==============

  seek(time) {
    if (this.ready) this.player.seek(this.currentTime + time);
  }

  play() {
    if (this.ready) this.player.play();
  }

  pause() {
    if (this.ready) this.player.pause();
  }

  get currentTime() {
    if (this.ready) return this.player.getCurrentTime();
  }

  get duration() {
    if (this.ready && !this._duration) {
      this._duration = this.player.getDuration();
    }
    return this._duration;
  }

  // ==============
  // Handler methods
  // ==============

  userPlay(event) {
    console.log('<Controller> Play!');
    this.stateUpdate(Constants.ControllerState.PLAY);
  }

  userPause(event) {
    console.log('<Controller> Pause!');
    this.stateUpdate(Constants.ControllerState.PAUSE);
  }

  userSeek(event) {
    // Todo
    console.log('<Controller> Seek!');
    return;
  }

  timeUpdate(event) {
    this.progressState.elapsed = event.target.currentTime;
    this.progressState.duration = event.target.duration;
    const req = {
      type: Constants.Protocol.Messages.UPDATE_TIME,
      progressState: this.progressState
    };

    window.postMessage(req);
  }

  onMessage(req) {
    switch (req.type) {
      case Constants.Protocol.Messages.UPDATE_STATE:
        break;
      case Constants.Protocol.Messages.UPDATE_TIME:
        break;
      case Constants.Protocol.Messages.UPDATE_STATE_TIME:
        console.log(req);
        switch (req.controllerState) {
          case Constants.ControllerState.PLAY:
            this.play();
            break;
          case Constants.ControllerState.PENDING:
          case Constants.ControllerState.PAUSE:
            this.pause();
          default:
            break;
        }
        this.seek(req.progressState.elapsed);
        break;
    }
  }
}

const controller = new NetflixController();
