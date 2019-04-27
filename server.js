const Lobby = require("./shared/model/lobby");
const User = require("./shared/model/user");
const short_id = require("shortid");
const WebSocket = require("ws");
const Constants = require("./shared/constants");

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
    console.log(msg);
    const data = JSON.parse(msg);

    if (!data) {
      console.log("<Error> Server received janky JSON data!");
      return;
    }

    console.log("<Info> Received message with type: ", data.type);

    if (data.type == Constants.Protocol.Messages.START_LOBBY) {
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
      const lobby = new Lobby(lobbyId, user);
      user.lobbyId = lobbyId;
      this.addLobby(lobby);

      const payload = JSON.stringify({
        type: Constants.Protocol.Messages.START_LOBBY_ACK,
        code: Constants.Protocol.SUCCESS,
        lobbyId: lobby.id
      });

      socket.send(payload);
      this.printLobbies();
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
    for (const lobbyId in this.lobbies) {
      const lobby = this.lobbies[lobbyId];
      if (lobby.contains(user)) {
        return true;
      }
    }
    return false;
  }

  printLobbies() {
    console.log("<Info> New lobby information:");
    console.log(this.lobbies);
  }
}

const ldnServer = new LDNServer(true);
