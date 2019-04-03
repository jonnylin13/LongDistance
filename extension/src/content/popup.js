const Constants = require('../util/constants');
const ViewState = require('../models/view-state');

class PopupController {
  constructor(viewState) {
    this._viewState = viewState;
    chrome.runtime.onMessage.addListener((req, sender, send) => {
      this._handleMessage(req, sender, send);
    });
  }

  get viewState() {
    return this._viewState;
  }

  // Handler Methods

  _handleMessage(req, sender, send) {
    if (sender.tab) return; // Ignore messages from content scripts

    if (!req.type) {
      console.log('<LDN> Invalid message to popup.js');
      return;
    }

    this._handleRequest(req, send);
    this._handleResponse(req, send);
  }

  _handleRequest(req, send) {
    // These will updates
  }

  _handleResponse(req, send) {
    if (req.type === 'start_lobby_ack') {
      if (req.code === 1) {
        this._viewState.update(Constants.ViewState.IN_LOBBY);
        const lobbyIdText = document.getElementById('lobby-id-text');
        lobbyIdText.innerHTML = req.lobbyId;
      }
    }
  }

  // Outbound to BG script

  dispatchStartLobby(event) {
    console.log('<LDN> Sending start_lobby to LDN');
    chrome.runtime.sendMessage({
      type: 'start_lobby'
    });
  }

  dispatchDisconnect(event) {
    console.log('<LDN> Sending disconnect to LDN');
    chrome.runtime.sendMessage({
      type: 'disconnect'
    });
  }

  dispatchConnect(event) {}

  dispatchConnectConfirm(event) {}

  back(event) {}

  handleResponse(event) {}
}

class LDNPopup {
  constructor() {
    document.addEventListener('DOMContentLoaded', this._init);
  }

  _init() {
    this._views = [];
    this._views[Constants.ViewState.IN_LOBBY] = document.getElementById(
      'in-lobby-container'
    );
    this._views[Constants.ViewState.OUT_LOBBY] = document.getElementById(
      'out-lobby-container'
    );
    this._views[Constants.ViewState.CONNECT_LOBBY] = document.getElementById(
      'connect-lobby-container'
    );
    this._viewState = new ViewState(this._views);
    this._controller = new PopupController(this._viewState);
    document
      .getElementById('start-lobby-btn')
      .addEventListener('click', this._controller.dispatchStartLobby);
    document
      .getElementById('disconnect-btn')
      .addEventListener('click', this._controller.dispatchConnectConfirm);
    document
      .getElementById('connect-btn')
      .addEventListener('click', this._controller.dispatchConnect);
    document
      .getElementById('connect-btn-back')
      .addEventListener('click', this._controller.back);
    document
      .getElementById('connect-confirm-btn')
      .addEventListener('click', this._controller.dispatchConnect);
  }
}

const popup = new LDNPopup();
