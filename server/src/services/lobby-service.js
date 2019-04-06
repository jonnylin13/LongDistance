const shortid = require("shortid");
const Lobby = require("../models/lobby");
const User = require("../models/user");

class LobbyService {
  constructor() {
    this._userMap = {}; // sessionId: lobbyId
    this._lobbies = {}; // lobbyId: lobby
  }

  _checkPrevious(sessionId) {
    if (this.hasLobby(sessionId)) {
      const _lobby = this._lobbies[this._userMap[sessionId]];
      if (_lobby.removeUser(sessionId)) {
        removeLobby(_lobby);
        // Todo: Send a disconnect to client in case it is connected to a socket?
        // It should not be able to connect or create if it is connected (view states)
        console.log("CHECK #33 & #34: Lobby has been garbage collected.");
      }
    }
  }

  remove(lobby) {
    delete this._lobbies[lobby.id];
    if (lobby.emitTask) {
      lobby.stopEmitTask();
    }
  }

  create(socket, sessionId) {
    // Todo: Check this code #33, #34
    try {
      this._checkPrevious();
      const lobbyId = shortid.generate();
      const user = new User(sessionId, socket);
      const lobby = new Lobby(lobbyId, user);
      // Todo: Check this code
      this._userMap[sessionId] = lobbyId;
      this._lobbies[lobbyId] = lobby;
      return true;
    } catch (e) {
      return false;
    }
  }

  connect(socket, lobby, sessionId) {
    try {
      this._checkPrevious();
      const user = new User(sessionId, socket);
      lobby.addSlave(user);
      this._userMap[sessionId] = lobby.id;
      return true;
    } catch (e) {
      return false;
    }
  }

  hasLobby(sessionId) {
    return this._userMap[sessionId] !== "";
  }

  getLobbyId(sessionId) {
    return this._userMap[sessionId];
  }

  // Todo: unused
  getLobby(lobbyId) {
    return this._lobbies[lobbyId];
  }

  getLobbyFromSessionId(sessionId) {
    return this._lobbies[this._userMap[sessionId]];
  }

  isConnected(sessionId) {
    return sessionId in this._userMap;
  }
}

module.exports = LobbyService;
