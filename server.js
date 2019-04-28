const Lobby = require('./shared/model/lobby');
const User = require('./shared/model/user');
const WebSocket = require('ws');
const Constants = require('./shared/constants');
// We use hri here because shared cannot import npm modules
const hri = require('human-readable-ids').hri;
const Util = require('./shared/util');

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
    switch (data.type) {
      case Constants.Protocol.Messages.START_LOBBY:
        this._startLobby(socket, data);
        break;
      case Constants.Protocol.Messages.DISCONNECT_LOBBY:
        this._disconnectLobby(socket, data);
        break;
      case Constants.Protocol.Messages.CONNECT_LOBBY:
        this._connectLobby(socket, data);
        break;
    }
  }

  // ===============
  // Private Methods
  // ===============
  _startLobby(socket, data) {
    const response = {
      type: Constants.Protocol.Messages.START_LOBBY_ACK
    };

    try {
      const user = User.fromJson(data.user);

      if (this.isConnected(user)) {
        // Something went wrong here...
        console.log('User is already connected. ID: ' + user.id);
        return;
      }

      // Server provisions user ID if none is sent in response
      if (user.id === null) {
        user.id = Util.uuidv4();
        response.userId = user.id;
        console.log('<Info> Provisioning new user: ' + user.id);
      }

      const lobby = new Lobby(hri.random(), user);
      user.lobbyId = lobby.id;
      this.addLobby(lobby);

      response.code = Constants.Protocol.SUCCESS;
      response.lobbyId = lobby.id;
    } catch (err) {
      response.code = Constants.Protocol.FAIL;
      console.log(err);
    }
    socket.send(JSON.stringify(response));
  }

  _connectLobby(socket, data) {
    const response = {
      type: Constants.Protocol.Messages.CONNECT_LOBBY_ACK
    };

    try {
      const user = User.fromJson(data.user);
      const lobby = this.getLobby(data.lobbyId);

      if (user.id === null) {
        user.id = Util.uuidv4();
        response.userId = user.id;
        console.log('<Info> Provisioning new user: ' + user.id);
      }

      lobby.add(user);
      response.code = Constants.Protocol.SUCCESS;
    } catch (err) {
      response.code = Constants.Protocol.FAIL;
      console.log(err);
    }
    socket.send(JSON.stringify(response));
  }

  _disconnectLobby(socket, data) {
    const response = {
      type: Constants.Protocol.Messages.DISCONNECT_LOBBY_ACK
    };
    try {
      const user = User.fromJson(data.user);
      const lobby = this.getLobby(user.lobbyId);
      lobby.remove(user);
      // Remove the lobby from this.lobbies is empty
      if (lobby.controllerId === null && lobby.size() === 0) {
        console.log('<Info> Deleting lobby: ' + user.lobbyId);
        delete this.lobbies[user.lobbyId];
      }

      response.code = Constants.Protocol.SUCCESS;
    } catch (err) {
      response.code = Constants.Protocol.FAIL;
      console.log(err);
    }
    socket.send(JSON.stringify(response));
  }

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

  getLobby(lobbyId) {
    if (this.contains(lobbyId)) return this.lobbies[lobbyId];
    else throw new Error('Could not find lobby in server.');
  }

  isConnected(user) {
    try {
      return this.getLobby(user.lobbyId).contains(user);
    } catch (err) {
      return false;
    }
  }
}

// So we can do testing?
module.exports = new LDNServer(true);
