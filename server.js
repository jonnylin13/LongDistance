const Lobby = require('./shared/model/lobby');
const User = require('./shared/model/user');
const WebSocket = require('ws');
const Constants = require('./shared/constants');
// We use hri here because shared cannot import npm modules
const hri = require('human-readable-ids').hri;

const PORT = 3000;

class LDNServer {
  constructor(start = true) {
    this.lobbies = {};
    process.on('exit', () => {
      this._exitHandler();
    });
    process.on('SIGINT', () => {
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
      '<Info> Connection received from: ',
      req.connection.remoteAddress
    );
    socket.on('message', msg => {
      this._onMessage(socket, msg);
    });
  }

  _onMessage(socket, msg) {
    const data = JSON.parse(msg);

    if (!data) {
      console.log('<Error> Server received janky JSON data!');
      return;
    }

    console.log('<Info> Received message with type: ', data.type);

    if (data.type == Constants.Protocol.Messages.START_LOBBY) {
      if (!data.user) {
        console.log('<Error> Tried to start a lobby without a user!');
        return;
      }
      const user = User.fromJson(data.user);

      if (user === null) {
        // Todo: Handle
        console.log('<Error> User could not be parsed from client.');
        return;
      }

      if (this.isConnected(user)) {
        console.log('<Error> User is already connected. ID: ' + user.id);
        return;
      }

      const lobby = new Lobby(hri.random(), user);
      user.lobbyId = lobby.id;
      this.addLobby(lobby);

      const payload = JSON.stringify({
        type: Constants.Protocol.Messages.START_LOBBY_ACK,
        code: Constants.Protocol.SUCCESS,
        lobbyId: lobby.id
      });

      socket.send(payload);
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
    console.log('<Info> Listening on port: ', PORT);
    this.server.on('connection', (socket, req) => {
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
}

const ldnServer = new LDNServer(true);
