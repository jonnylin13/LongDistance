const Constants = require("./util/constants");

class SocketController {
  constructor(tabListener) {
    this._tabs = tabListener;
    this._ws = null;
    if (!this._connect(null)) {
      throw new Error("<LDN> Could not connect to WebSocket server!");
    }
  }

  // ===============
  // Handler Methods
  // ===============

  _onClose(event) {
    // What is this for really?
    if (this._tabs.clientState.connectedToLobby()) {
      this._connect(null);
    }
  }

  // Inbound Socket Messages
  _handleMessage(msg) {
    const data = JSON.parse(msg.data);

    console.log("<LDN> Socket received msg of type: ", data.type);

    this._handleRequest(data);
    this._handleResponse(data);
  }

  _handleResponse(data) {
    if (data.type === "create_lobby_ack") {
      const lobbyId = data.lobby_id;
      this._tabs.clientState.lobbyId = lobbyId;
      this._tabs.clientState.sessionId = data.session_id;

      // Send a start_lobby_ack to popup.js
      chrome.runtime.sendMessage({
        type: "start_lobby_ack",
        lobbyId: lobbyId,
        code: 1
      });
    }
  }

  _handleRequest(data) {
    // Todo
  }

  // ===============
  // Private Methods
  // ===============

  _connect(cb) {
    if (!this._socketOpen()) {
      try {
        this._ws = new WebSocket(Constants.WS_URL);
        this._ws.onopen = () => {
          this._ws.onmessage = msg => {
            this._handleMessage(msg);
          };
          if (cb) cb();
        };

        this._ws.close = event => {
          this._onClose();
        };
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    }
    return true;
  }

  _socketOpen() {
    return this._ws !== null && this._ws.readyState === 4;
  }

  _send(json) {
    if (
      this._connect(() => {
        this._ws.send(JSON.stringify(json));
      })
    ) {
    } else {
      // Todo: handle error
      return;
    }
  }

  // ==============
  // Public Methods
  // ==============

  // Outbound Socket Messages
  createLobby() {
    this._send({
      type: "create_lobby"
    });
  }

  // Setters and Getters
  get tabListener() {
    return this._tabs;
  }
}

module.exports = SocketController;
