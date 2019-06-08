import Constants from '../shared/constants';
import ProgressState from '../shared/model/progressState';

// NOT PERSISTENT
// Essential help
// https://stackoverflow.com/questions/41985502/how-to-interact-with-netflix-cadmium-video-player-on-the-client
// https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver

const spinner = document.createElement('div');
spinner.id = 'ldn-spinner';
spinner.style.position = 'absolute';
spinner.style.display = 'flex';
spinner.style.alignItems = 'center';
spinner.style.justifyContent = 'center';
spinner.style.top = '50%';
spinner.style.left = '50%';
spinner.style.padding = '2rem';
spinner.style.transform = 'translate(-50%, -50%)';
spinner.style.height = '100%';
spinner.style.width = '100%';
spinner.style.color = 'black';
spinner.style.backgroundColor = 'white';
spinner.style.zIndex = '1000';

const memberJoin = 'Please wait while other members join.';
const videoLoad = 'Please wait while Netflix loads.';

function spinHtml(msg) {
  return (
    '<div style="text-align: center;"><h1>' +
    msg +
    '</h1><img src="https://cdnjs.cloudflare.com/ajax/libs/galleriffic/2.0.1/css/loader.gif" /></div>'
  );
}

class NetflixController {
  constructor() {
    this.enabled = false;
    this.syncing = false;
    this.progressState = new ProgressState();
    this.ignoreQ = [];

    // Messages from ldn.js and postMessage
    window.addEventListener('message', event => {
      this.onMessage(event.data);
    });

    this._enable();
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

  _enable() {
    if (this.enabled) return;
    spinner.innerHTML = spinHtml(videoLoad);
    this.sync();

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

          console.log('<Controller> Script enabled!');
          observer.disconnect();
          this.enabled = true;

          // Enter sync mode, ping ldn.js
          this.pause();
          spinner.innerHTML = spinHtml(memberJoin);
          this.unlock();
          this.progressState.elapsed = this.player.getCurrentTime();
          this.progressState.duration = this.player.getDuration();
          this.ping();
        }
      });
    });

    observer.observe(document.getElementById('appMountPoint'), {
      childList: true,
      subtree: true
    });
  }

  _disable() {
    if (!this.enabled) return;
    this.unlock();
    this.enabled = false;
  }

  // ==============
  // Public Methods
  // ==============

  seek(time) {
    if (this.enabled) {
      this.player.seek(this.currentTime + time);
      this.ignoreQ.push('seek');
    }
  }

  play() {
    if (this.enabled) {
      this.player.play();
      this.ignoreQ.push('play');
    }
  }

  pause() {
    if (this.enabled) {
      this.player.pause();
      this.ignoreQ.push('pause');
    }
  }

  sync() {
    document.body.appendChild(spinner);
    this.syncing = true;
  }

  unlock() {
    if (this.enabled) {
      spinner.remove();
      this.syncing = false;
    }
  }

  get currentTime() {
    if (this.enabled) return this.player.getCurrentTime();
  }

  get duration() {
    if (this.enabled && !this._duration) {
      this._duration = this.player.getDuration();
    }
    return this._duration;
  }

  // ==============
  // Handler methods
  // ==============

  _shouldIgnore(event) {
    if (this.ignoreQ.length < 1) {
      return false;
    }
    let frontType = this.ignoreQ[0];
    if (frontType === event.type) {
      this.ignoreQ.splice(0, 1);
      return true;
    }
    return false;
  }
  userPlay(event) {
    if (this._shouldIgnore(event)) return;
    console.log('<Controller> Play!');
    this.stateUpdate(Constants.ControllerState.PLAY);
  }

  userPause(event) {
    if (this._shouldIgnore(event)) return;
    console.log('<Controller> Pause!');
    this.stateUpdate(Constants.ControllerState.PAUSE);
  }

  userSeek(event) {
    // Todo
    if (this._shouldIgnore(event)) return;
    console.log('<Controller> Seek!');
    return;
  }

  timeUpdate(event) {
    this.progressState.elapsed = this.player.getCurrentTime();
    this.progressState.duration = this.player.getDuration();
    const req = {
      type: Constants.Protocol.Messages.UPDATE_TIME,
      progressState: this.progressState
    };

    window.postMessage(req);
  }

  ping() {
    const req = {
      type: Constants.Protocol.Messages.SYNC_PING,
      progressState: this.progressState
    };

    window.postMessage(req);
  }

  onMessage(req) {
    if (req.type === Constants.Protocol.Messages.UPDATE_CONTROL_SCRIPT) {
      console.log(req);
      if (req.code) this._enable();
      else this._disable();
    }
    switch (req.type) {
      case Constants.Protocol.Messages.UPDATE_CONTROL_SCRIPT:
        console.log(req);
        if (req.code) this._enable();
        else this._disable();
        break;
      case Constants.Protocol.Messages.RESYNC:
        // TODO
        break;
    }
    if (!this.enabled) {
      console.log(
        '<Controller> Received a message <' + req.type + '>  while disabled.'
      );
      return;
    }
    switch (req.type) {
      case Constants.Protocol.Messages.UPDATE_STATE:
        break;
      case Constants.Protocol.Messages.UPDATE_TIME:
        break;
      case Constants.Protocol.Messages.UPDATE_STATE_TIME:
        // console.log(req);
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
