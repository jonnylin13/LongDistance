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

class LDNClient {
  constructor() {
    console.log("<Info> Starting LDN...");

    this.user = new User(
      this._provisionClientId(),
      Constants.Codes.ControllerState.INACTIVE,
      "",
      new ProgressState()
    );
    // this.currentLobby = null;
    this.ws = null;

    this.tabListener = new TabListener(this);
    this.messageListener = new LDNMessageListener(this);

    console.log("<Info> LDN has been started!");
  }

  _onMessage(event) {
    console.log(event.data);
    const data = JSON.parse(event.data);
    if (data.type === "START_LOBBY_ACK") {
      console.log("<Info> Received START_LOBBY_ACK");
      // TODO: Update user
      this.user.updateFromJson(event.data);
      // TODO: Update lobby ID in popup?
      resolve(data);
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
      console.log();
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
    return new Promise(resolve => {
      this.ws.onopen = () => {
        console.log(msg);
        this.ws.send(msg.toJson());
      };
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

const ldn = new LDNClient();
