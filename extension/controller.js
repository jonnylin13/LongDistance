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
    const observer = new MutationObserver((mutations, observer) => {
      mutations.forEach(mutation => {
        if (mutation.target.className === 'VideoContainer') {
          // DO something
          this.videoPlayer = netflix.appContext.state.playerApp.getAPI().videoPlayer;
          this.sessionId = this.videoPlayer.getAllPlayerSessionIds()[0];
          this.player = this.videoPlayer.getVideoPlayerBySessionId(
            this.sessionId
          );
          this.getVP().on('play', event => this.userPlay(event));
          this.getVP().on('pause', event => this.userPause(event));
          this.getVP().on('timeupdate', event => this.timeUpdate(event));
          this.getVP().on('seeked', event => this.userSeek(event));

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

  // Popup script is not persistent, or run in the same context
  // So we cannot use LDNClient.getInstance()
  getClient() {
    return new Promise((resolve, reject) => {
      chrome.runtime
        .getBackgroundPage(page => {
          resolve(page.ldn);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  getVP() {
    return $('video');
  }

  stateUpdate(_controllerState) {
    const req = {
      type: Constants.Protocol.Messages.UPDATE_STATE,
      controllerState: _controllerState
    };
    chrome.runtime.sendMessage(req);
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

  sync() {
    // TODO: Re-implement this
    return;
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
    return;
  }

  timeUpdate(event) {
    this.progressState.elapsed = event.target.currentTime;
    this.progressState.duration = event.target.duration;
    const req = {
      type: Constants.Protocol.Messages.UPDATE_TIME,
      progressState: this.progressState
    };
    chrome.runtime.sendMessage(req);
  }
}

const controller = new NetflixController();
