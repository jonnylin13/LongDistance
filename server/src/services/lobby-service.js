const shortid = require('shortid');
const Lobby = require('../models/lobby');
const User = require('../models/user');

class LobbyService {

    constructor() {
        this._userMap = {}; // sessionId: lobbyId
        this._lobbies = {}; // lobbyId: lobby
    }

    removeLobby(lobby) {
        
        delete this._lobbies[lobby.id];
        if (lobby.emitTask) {
            lobby.stopEmitTask();
        }
    }

    createLobby(socket, sessionId) {
        
        // Todo: Check if user is in lobby
        try {
            const lobbyId = shortid.generate();
            const user = new User(sessionId, socket);
            const lobby = new Lobby(lobbyId, user);
            // Todo
            this._userMap[sessionId] = lobbyId;
            this._lobbies[lobbyId] = lobby;
            return true;

        } catch(e) {
            return false;
        }

    }

    connectLobby(socket, lobby, sessionId) {

        try {
            // Check if user is in lobby
            if (this.hasLobby(sessionId)) {
                
                // Get our lobby record
                const _lobby = this._lobbies[this._userMap[sessionId]];
                _lobby.removeUser(sessionId);
                if (_lobby.master === null) {
                    delete this._lobbies[this._userMap[sessionId]];
                    this._userMap[sessionId] = '';
                }

            }

            const user = new User(sessionId, socket);
            lobby.addSlave(user);
            this._userMap[sessionId] = lobby.id;
            return true;
        } catch(e) {
            return false;
        }
        
    }

    hasLobby(sessionId) {
        return this._userMap[sessionId] !== '';
    }

    initUser(sessionId) {
        this._userMap[sessionId] = '';
    }

    getLobbyId(sessionId) {
        return this._userMap[sessionId];
    }

    // Todo: unused
    getLobby(lobbyId) {
        return this._lobbies[lobbyId];
    }

    getLobbyFromSession(sessionId) {
        return this._lobbies[this._userMap[sessionId]];
    }

    isConnected(sessionId) {
        return sessionId in this._userMap;
    }

}

module.exports = LobbyService;