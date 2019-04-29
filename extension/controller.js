import Constants from '../shared/constants';

// NOT PERSISTENT
class NetflixController {
  constructor() {
    console.log('<Info> Starting controller...');
    console.log('<Info> Controller has been started!');
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

  _get_video() {
    return $('video');
  }

  _get_play() {
    return $('.button-nfplayerPlay')[0];
  }

  _get_player() {
    return $('.nf-player-container')[0];
  }

  _get_pause() {
    return $('.button-nfplayerPause')[0];
  }

  _get_scrubber() {
    return $('.scrubber-bar')[0];
  }

  // ==============
  // Public Methods
  // ==============

  play() {}

  pause() {}

  sync() {
    // TODO: Re-implement this
    return;
  }
}

const controller = new NetflixController();
