/**
 * @author Jonathan Lin
 * @description Background script for LDN Chrome extension
 */

import TabListener from './listeners/tabListener';
import Constants from '../shared/constants';
import ProgressState from '../shared/model/progressState';
import User from '../shared/model/user';

export default class LDNClient {
  static getInstance() {
    if (!this._instance) this._instance = new LDNClient();
    return this._instance;
  }

  constructor() {
    console.log('<Info> Starting LDN...');

    this.user = new User(
      Constants.ControllerState.INACTIVE,
      '',
      new ProgressState()
    );

    this.ws = null;
    this.tabListener = new TabListener();

    console.log('<Info> LDN has been started!');
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
            console.log('<Info> Connected to WebSocket server');
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
                if (this.user.id === null) this.user.id = data.userId;
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
      console.log('<Info> Received message with type: ', data.type);
      switch (data.type) {
        case Constants.Protocol.Messages.DISCONNECT_LOBBY_ACK:
          if (data.code === Constants.Protocol.SUCCESS)
            this.user.lobbyId = null;
          else {
            // Todo?
          }
          break;
      }
    } catch (err) {
      console.log(err);
    }
  }
}

window.ldn = LDNClient.getInstance();
