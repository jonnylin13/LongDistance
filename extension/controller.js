import Constants from '../shared/constants';

// NOT PERSISTENT
class NetflixController {
  constructor() {
    const observer = new MutationObserver((mutList, observer) => {
      mutList.forEach(mutation => {
        if (mutation.target.className === 'VideoContainer') {
          // DO something
          this.getVP().on('play', event => this.userPlay(event));
          this.getVP().on('pause', event => this.userPause(event));
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
  _getLDNClientInstance() {
    return chrome.extension.getBackgroundPage().ldn;
  }

  _start() {}

  getVP() {
    return $('video');
  }

  // ==============
  // Public Methods
  // ==============

  play() {
    if (this.getVP()) this.getVP().play();
  }

  pause() {
    if (this.getVP()) this.getVP().pause();
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
}

const controller = new NetflixController();
