/**
 * @author Jonathan Lin
 * @description Background script for LDN Chrome extension
 */

import TabListener from './listeners/tabListener';
import Constants from '../shared/constants';
import User from '../shared/model/user';

export default class LDNClient {
  static getInstance() {
    if (!this._instance) this._instance = new LDNClient();
    return this._instance;
  }

  constructor() {
    this.user = new User();
    this.ws = null;
    this.tabListener = new TabListener();
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) =>
      this._onRuntimeMessage(msg, sender, sendResponse)
    );
    console.log('<LDN> LDN has been started!');
  }

  // ===============
  // Private Methods
  // ===============

  _connect() {
    return new Promise((resolve, reject) => {
      if (!this.isSocketConnected()) {
        try {
          this.ws = new WebSocket(Constants.WS_URL);
          this.ws.onopen = () => {
            console.log('<LDN> Connected to WebSocket server');
            resolve(null);
          };
        } catch (err) {
          reject(err);
        }
      } else {
        resolve(null);
      }
    });
  }

  // ==============
  // Public Methods
  // ==============

  startLobby(msg) {
    return new Promise((resolve, reject) => {
      this._connect()
        .then(() => {
          msg.user = JSON.stringify(this.user);
          this.ws.send(JSON.stringify(msg));
          // This is a one time event listener
          this.ws.onmessage = event => {
            try {
              const data = JSON.parse(event.data);
              if (
                data.type === Constants.Protocol.Messages.START_LOBBY_ACK &&
                data.code === Constants.Protocol.SUCCESS
              ) {
                this.user.lobbyId = data.lobbyId;
                this.user.controller = true;
                // Server provisions the user ID in response if none is sent in request
                if (this.user.id === null) this.user.id = data.userId;
                // Don't need to return anything
                resolve(true);
              } else reject(false);
            } catch (err) {
              // Todo?
              reject(false);
            } finally {
              this.ws.onmessage = event => this._onMessage(event);
            }
          };
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  // Pretty much identical to start_lobby, but we'll leave this for now for testing
  connectLobby(msg) {
    return new Promise((resolve, reject) => {
      this._connect()
        .then(() => {
          msg.user = JSON.stringify(this.user);
          this.ws.send(JSON.stringify(msg));
          // 1 time listener
          this.ws.onmessage = event => {
            try {
              const data = JSON.parse(event.data);
              if (
                data.type === Constants.Protocol.Messages.CONNECT_LOBBY_ACK &&
                data.code === Constants.Protocol.SUCCESS
              ) {
                this.user.lobbyId = msg.lobbyId;
                this.user.controller = false;
                if (this.user.id === null) this.user.id = data.userId;
                // If the response contains controller
                console.log(data);
                if (data.controller) {
                  const controller = JSON.parse(data.controller);
                  this._onMessage({
                    data: JSON.stringify({
                      type: Constants.Protocol.Messages.UPDATE_URL,
                      urlParams: controller.urlParams
                    })
                  });
                }
                resolve(true);
              } else {
                reject(false);
              }
            } catch (err) {
              // Todo?
              console.log(err);
              reject(false);
            } finally {
              this.ws.onmessage = event => this._onMessage(event);
            }
          };
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  disconnectLobby(msg) {
    this._connect()
      .then(() => {
        msg.user = JSON.stringify(this.user);
        this.ws.send(JSON.stringify(msg));
      })
      .catch(err => {
        console.log(err);
      });
  }

  setUrlParams(urlParams) {
    this.user.urlParams = urlParams;
    // If the user is a controller && user is watching new content, then send url update request to server
    if (this.user.controller) {
      if (urlParams.includes('watch/')) {
        this._connect().then(() => {
          const msg = {
            type: Constants.Protocol.Messages.UPDATE_URL,
            urlParams: this.user.urlParams,
            user: JSON.stringify(this.user)
          };
          this.ws.send(JSON.stringify(msg));
        });
      }
    }
  }

  isConnected() {
    return this.user.currentLobby && this.user.id;
  }

  isSocketConnected() {
    return this.ws && this.ws.readyState === this.ws.OPEN;
  }

  // ===============
  // Handler Methods
  // ===============

  _onMessage(event) {
    try {
      const data = JSON.parse(event.data);
      console.log('<LDN> Received message with type: ', data.type);
      switch (data.type) {
        case Constants.Protocol.Messages.DISCONNECT_LOBBY_ACK:
          if (data.code === Constants.Protocol.SUCCESS) {
            this.user.lobbyId = null;
            this.user.controller = false;
          } else {
            // Todo?
          }
          break;
        case Constants.Protocol.Messages.UPDATE_URL:
          if (this.user.urlParams !== data.urlParams) {
            chrome.tabs.update(this.tabListener.tabId, {
              url: 'https://netflix.com/' + data.urlParams
            });
          }
          break;
        case Constants.Protocol.Messages.UPDATE_CONTROL:
          this.user.controller = data.code;
          break;
        case Constants.Protocol.Messages.RESYNC:
          // TODO: Handle resync...

          break;
        default:
          console.log('<LDN> Unhandled msg: ', data.type);
      }
    } catch (err) {
      console.log(err);
    }
  }

  _onRuntimeMessage(msg, sender, sendResponse) {
    try {
      switch (msg.type) {
        case Constants.Protocol.Messages.UPDATE_TIME:
          this.user.progressState = msg.progressState;
          break;
        case Constants.Protocol.Messages.UPDATE_STATE:
          this.user.controllerState = msg.controllerState;
          break;
        case Constants.Protocol.Messages.SYNC_PING:
          this.user.progressState = msg.progressState;
          if (this.user.controller) {
            const msg = {
              type: Constants.Protocol.Messages.SYNC_PING,
              user: this.user
            };
            this.ws.send(JSON.stringify(msg));
          }
          break;
      }
    } catch (err) {
      console.log(err);
    }
  }
}

window.ldn = LDNClient.getInstance();
