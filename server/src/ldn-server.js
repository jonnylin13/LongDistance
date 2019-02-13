const WebSocket = require('ws');
const shortid = require('shortid');
const crypto = require('crypto');

const User = require('./models/user');
const Lobby = require('./models/lobby');

class LDNResponse {

    static validate(socket, data, fields) {
        for (const field in fields) {
            if (!data[field]) { 
                socket.send({ type: data.type + '_ack', msg: 'Missing field(s).', code: -1 });
                return false;
            }
        }
        return true;
    }

}

class LDNServer {

    constructor(start=true, port=3000) {
        this._userMap = {}; // M amount of entries where M in the number of users
        this._lobbies = {}; // N amount of entries where N is the number of lobbies
        this._port = port;
        if (start) this.start();

        process.on('SIGINT', () => {
            if (this._server) {
                this._server.close();
            }
            console.log('<Info> Shutting down');
            process.exit();
        });

    }

    // ===============
    // Private Methods
    // ===============
    _start() {
        this._server = new WebSocket.Server({ port: this._port });
        console.log('<Info> Listening on port: ' + this.port);
        this._server.on('connection', this._onConnection);
    }

    _startLobby(socket, sessionId) {
        
        // Check if user is in lobby
        try {
            const lobbyId = shortid.generate();
            const user = new User(sessionId, socket);
            const lobby = new Lobby(lobbyId, user);
            this._userMap[sessionId] = lobbyId;
            this._lobbies[lobbyId] = lobby;
            return true;

        } catch(e) {
            return false;
        }

    }

    _connectLobby(socket, lobbyId, sessionId) {

        try {
            // Check if user is in lobby
            if (this.hasLobby(sessionId)) {
                
                // Get our lobby record
                const lobby = this._lobbies[this._userMap[sessionId]];
                lobby.removeUser(sessionId);
                if (lobby.master === null) {
                    delete this._lobbies[this._userMap[sessionId]];
                    this._userMap[sessionId] = '';
                }

            }

            const lobby = this._lobbies[lobbyId];
            const user = new User(sessionId, socket);
            lobby.addSlave(user);
            this._userMap[sessionId] = lobbyId;
            return true;
        } catch(e) {
            return false;
        }
        
    }

    _onConnection(socket, req) {

        console.log('<Info> Connection received from: ', req.connection.remoteAddress);

        const sessionId = crypto.randomBytes(16).toString('hex');

        // If this fails, then the client must disconnect and reconnect
        socket.send({
            'type': 'connect_ack',
            'session_id': sessionId
        });
        
        // Add the session to the user map
        this._userMap[sessionId] = '';

        socket.on('message', (msg) => {
            this._onMessage(socket, req, msg);
        });
    }

    _onMessage(socket, req, msg) {
        const data = JSON.parse(msg);
            if (!data) {
                console.log('<Error> Received bad data from socket connection: ', req.connection.remoteAddress);
                return;
            }
            if (!LDNResponse.validate(socket, data, ['type'])) return;

            const payload = { type: req.type + '_ack' }

            if (data.type === 'start_lobby') {
                
                if (!LDNResponse.validate(socket, data, ['session_id'])) return;

                const sessionId = data.session_id;

                // Todo: Validate session ID

                if (this._startLobby(socket, sessionId)) {
                    payload.code = 1;
                    payload.lobby_id = this._userMap[sessionId];
                } else {
                    payload.code = 0;
                    payload.msg = 'Calling startLobby() failed.';
                }

            } else if (data.type === 'connect_lobby') {

                if (!LDNResponse.validate(socket, data, ['session_id', 'lobby_id'])) return;

                // Todo: Validate lobby

                const sessionId = data.session_id;
                const lobbyId = data.lobby_id;

                if (this._connectLobby(socket, lobbyId, sessionId)) {
                    payload.code = 1;
                    payload.lobby_id = lobbyId;
                } else {
                    payload.code = 0;
                    payload.msg = 'Calling connectLobby() failed.';
                }

            } else if (data.type === 'start_control') {

                if (!LDNResponse.validate(socket, data, ['session_id'])) return;

                const sessionId = data.sessionId;
                const lobby = this._lobbies[this._userMap[sessionId]];
                // Todo: Validate lobby
                // Todo: Validate session id
                // Todo: Start timer with emit pings for latency and master updates


            }
            socket.send(payload);
            return;
    }

    // ==============
    // Public Methods
    // ==============
    hasLobby(sessionId) {
        return this._userMap[sessionId] !== '';
    }

    isConnected(sessionId) {
        return sessionId in this._userMap;
    }

    start() {
        if (this._server) {
            this._server.close((err) => {
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
        this._server.close((err) => {
            console.log(err);
        });
    }

}

module.exports = LDNServer;