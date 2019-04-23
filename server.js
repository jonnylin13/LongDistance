const Lobby = require("./shared/model/lobby");
const User = require("./shared/model/user");
const ProgressState = require("./shared/model/progressState");
const StartLobbyAckMessage = require("./shared/protocol/startLobbyAck");
const short_id = require("shortid");
const WebSocket = require("ws");

const PORT = 3000;

class LDNServer {
  constructor(start = true) {
    this.lobbies = {};
    process.on("exit", () => {
      this._exitHandler();
    });
    process.on("SIGINT", () => {
      this._exitHandler();
    });
    if (start) this.start();
  }

  // ===============
  // Handler Methods
  // ===============

  _exitHandler() {
    if (this.server) this.server.close();
  }

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
      console.log("<Error> Server received janky JSON data!");
      return;
    }

    console.log("<Info> Received message with type: ", data.type);
    if (data.type == "START_LOBBY") {
      this.startLobby(socket, data);
    }
  }

  // ===============
  // Private Methods
  // ===============

  // ==============
  // Public Methods
  // ==============

  start() {
    this.server = new WebSocket.Server({ port: PORT });
    console.log("<Info> Listening on port: ", PORT);
    this.server.on("connection", (socket, req) => {
      this._onConnection(socket, req);
    });
  }

  contains(lobbyId) {
    return lobbyId in this.lobbies;
  }

  addLobby(lobby) {
    if (!this.contains(lobby.id)) this.lobbies[lobby.id] = lobby;
  }

  isConnected(user) {
    for (lobbyId in this.lobbies) {
      const lobby = this.lobbies[lobbyId];
      if (lobby.contains(user)) {
        return true;
      }
    }
    return false;
  }

  startLobby(socket) {
    if (!data.user) {
      console.log("<Error> Tried to start a lobby without a user!");
      return;
    }

    const lobbyId = short_id.generate();
    const user = User.fromJson(data.user);

    if (this.isConnected(user)) {
      console.log("<Error> User is already connected. ID: ", str(user.id));
      return;
    }
    const lobby = Lobby(lobbyId, user);
    user.lobbyId = lobbyId;
    this.addLobby(lobby);
    socket.send(new StartLobbyAckMessage({ lobbyId: lobby.id }).toJson());
    this.printLobbies();
  }

  printLobbies() {
    console.log("<Info> New lobby information:");
    console.log(this.lobbies);
  }
}

const ldnServer = new LDNServer(true);
