/**
 * @author Jonathan Lin
 * @description Background script for LDN Chrome extension
 */

import TabListener from "./listeners/tabListener";
import LDNMessageListener from "./listeners/ldnListener";
import Constants from "../shared/constants";
import ProgressState from "../shared/model/progressState";
import User from "../shared/model/user";
import Util from "../shared/util";

export default class LDNClient {
  static getInstance() {
    if (!this._instance) this._instance = new LDNClient();
    return this._instance;
  }

  constructor() {
    console.log("<Info> Starting LDN...");

    this.user = new User(
      this._provisionClientId(),
      Constants.ControllerState.INACTIVE,
      "",
      new ProgressState()
    );
    // this.currentLobby = null;
    this.ws = null;

    this.tabListener = new TabListener();
    this.messageListener = new LDNMessageListener();

    console.log("<Info> LDN has been started!");
  }

  _onMessage(event) {
    const data = JSON.parse(event.data);
    console.log("<Info> Received " + data.type + "from websocket server");
    if (data.type === Constants.Protocol.Messages.START_LOBBY_ACK) {
      if (data.code === Constants.Protocol.SUCCESS) {
        // TODO: Update user
        this.user.updateFromJson(data.user);
        // TODO: Update lobby ID in popup?
        // How?
      }
    }
  }

  // ===============
  // Private Methods
  // ===============

  _provisionClientId() {
    return Util.uuidv4();

    // TODO: local memory storage
    chrome.storage.sync.get("ldnClientId", function(items) {
      const id = items.clientId;
      if (id) {
        return id;
      } else {
        const clientId = Util.uuidv4();
        chrome.storage.sync.set({ ldnClientId: clientId });
        return clientId;
      }
    });
  }

  _hasController(data) {
    if (!data.controlId) {
      return false;
    }
    return data.controlId == this.user.id;
  }

  _connect() {
    if (!this.isSocketConnected()) {
      try {
        this.ws = new WebSocket(Constants.WS_URL);
        this.ws.onmessage = event => this._onMessage(event);
        console.log("<Info> Connected to websocket server");
        return true;
      } catch (exception) {
        return false;
      }
    }
  }

  // ==============
  // Public Methods
  // ==============

  startLobby(msg) {
    this._connect();
    msg.user = this.user;
    this.ws.onopen = () => {
      this.ws.send(JSON.stringify(msg));
    };
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
