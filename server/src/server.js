const WebSocket = require("ws");
const crypto = require("crypto");

const LobbyService = require("./services/lobby-service");
const LDNResponse = require("./util/response");

class LDNServer {
  constructor(start = true, port = 3000) {
    this._port = port;
    this._lobbyService = new LobbyService();
    if (start) this.start();

    process.on("SIGINT", () => {
      if (this._server) {
        this._server.close();
      }
      console.log("<Info> Shutting down");
      process.exit();
    });
  }

  // ===============
  // Private Methods
  // ===============
  _start() {
    this._server = new WebSocket.Server({ port: this._port });
    console.log("<Info> Listening on port: " + this.port);
    this._server.on("connection", (socket, req) => {
      this._onConnection(socket, req);
    });
  }

  _generateSessionId() {
    const sessionId = crypto.randomBytes(16).toString("hex");
    return sessionId;
  }

  // ===============
  // Handler Methods
  // ===============
  _onConnection(socket, req) {
    console.log(
      "<Info> Connection received from: ",
      req.connection.remoteAddress
    );

    socket.on("message", msg => {
      this._onMessage(socket, msg);
    });
  }

  _onMessage(socket, msg) {
    const data = JSON.parse(msg);
    if (!data) {
      console.log(
        "<Error> Received bad data from socket connection: ",
        req.connection.remoteAddress
      );
      return;
    }
    if (!LDNResponse.validateFields(socket, data, ["type"])) return;
    console.log("<Info> Received a message: ");
    console.log(msg);
    this._handleRequest(socket, data);
    this._handleResponse(data);
  }

  // Inbound Socket Requests
  _handleRequest(socket, data) {
    const payload = { type: data.type + "_ack" };

    if (data.type === "create_lobby") {
      const sessionId = this._generateSessionId();

      if (this._lobbyService.create(socket, sessionId)) {
        payload.code = 1;
        payload.lobby_id = this._lobbyService.getLobbyId(sessionId);
        payload.session_id = sessionId;
      } else {
        payload.code = 0;
        payload.msg = "Calling createLobby() failed.";
      }
    } else if (data.type === "connect_lobby") {
      if (!LDNResponse.validateFields(socket, data, ["lobby_id"])) return;

      const sessionId = _generateSessionId();
      const lobbyId = data.lobby_id;
      const lobby = this._lobbyService.getLobby(lobbyId);

      if (!LDNResponse.validateLobby(socket, lobby, data)) return;

      if (this._lobbyService.connect(socket, lobby, sessionId)) {
        payload.code = 1;
        payload.lobby_id = lobbyId;
        payload.session_id = sessionId;
      } else {
        payload.code = 0;
        payload.msg = "Calling connectLobby() failed.";
      }
    } else if (data.type === "start_control") {
      if (!LDNResponse.validateFields(socket, data, ["session_id"])) return;

      const sessionId = data.sessionId;
      const lobby = this._lobbyService.getLobbyFromSessionId(sessionId);
      if (!LDNResponse.validateLobby(socket, lobby, data)) return;
      // Todo: Authorize session id

      if (lobby.emitTask) {
        // Todo: Test/never reached
        lobby.stopEmitTask();
      }

      if (lobby.startEmitTask()) {
        payload.code = 1;
      }
    } else if (data.type === "disconnect") {
      // Todo: Handle disconnect #32
    }
    socket.send(JSON.stringify(payload));
    return;
  }

  _handleResponse(data) {
    // These do not send a response, they just update server state
    if (data.type === "update_ack") {
      // Todo: Handle server state update
    }
  }

  // ==============
  // Public Methods
  // ==============

  start() {
    if (this._server) {
      this._server.close(err => {
        if (err) {
          console.log(err);
          return;
        }
        this._start();
      });
    } else {
      this._start();
    }
  }

  get port() {
    return this._port;
  }

  close() {
    this._server.close(err => {
      console.log(err);
    });
  }
}

module.exports = LDNServer;
