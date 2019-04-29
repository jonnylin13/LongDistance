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
          this.getVP().on('play', event => this.userPlay(event));
          this.getVP().on('pause', event => this.userPause(event));
          this.getVP().on('timeupdate', event => this.timeUpdate(event));
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

  // ==============
  // Public Methods
  // ==============

  play() {
    if (this.ready) this.getVP()[0].play();
  }

  pause() {
    if (this.ready) this.getVP()[0].pause();
  }

  get currentTime() {
    if (this.ready) return this.getVP()[0].currentTime;
  }

  get duration() {
    if (this.ready && !this._duration) {
      this._duration = this.getVP()[0].duration;
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

  userPlay() {
    console.log('Play!');
  }

  userPause() {
    console.log('Pause!');
  }

  timeUpdate(event) {
    this.progressState.elapsed = event.target.currentTime;
    this.progressState.duration = event.target.duration;
    const req = {
      type: Constants.Protocol.Messages.UPDATE_STATE,
      progressState: this.progressState
    };
    chrome.runtime.sendMessage(req);
  }
}

const controller = new NetflixController();
