/**
 * @author Jonathan Lin
 * @description Background script for LDN Chrome extension
 */

import TabListener from "./listeners/tabListener";
import Constants from "../shared/constants";
import ProgressState from "../shared/model/progressState";
import User from "../shared/model/user";

export default class LDNClient {
  static getInstance() {
    if (!this._instance) this._instance = new LDNClient();
    return this._instance;
  }

  constructor() {
    console.log("<Info> Starting LDN...");

    this.user = new User(
      Constants.ControllerState.INACTIVE,
      "",
      new ProgressState()
    );

    this.ws = null;
    this.tabListener = new TabListener();

    console.log("<Info> LDN has been started!");
  }

  // ===============
  // Private Methods
  // ===============

  _onMessage(event) {
    try {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case Constants.Protocol.Messages.DISCONNECT_LOBBY_ACK:
          break; // Todo: #36
      }
    } catch (err) {
      console.log(err);
    }
  }

  _hasController(data) {
    if (!data.controlId) {
      return false;
    }
    return data.controlId == this.user.id;
  }

  _connect() {
    return new Promise((resolve, reject) => {
      if (!this.isSocketConnected()) {
        try {
          this.ws = new WebSocket(Constants.WS_URL);
          this.ws.onopen = () => {
            console.log("<Info> Connected to WebSocket server");
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
              this.user.id = data.userId;
              // Don't need to return anything
              resolve(true);
            } else reject(false);
          } catch (err) {
            reject(false);
          } finally {
            this.ws.onmessage = event => this._onMessage(event);
          }
        };
      })
      .catch(err => {
        reject(err);
      });
  }

  // Todo: #36 check this
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
}

LDNClient.getInstance();
