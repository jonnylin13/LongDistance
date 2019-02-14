const WebSocket = require('ws');
const crypto = require('crypto');

const LobbyService = require('./services/lobby-service');
const LDNResponse = require('./util/response');

class LDNServer {

    constructor(start=true, port=3000) {
        this._port = port;
        this._lobbyService = new LobbyService();
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

    _onConnection(socket, req) {

        console.log('<Info> Connection received from: ', req.connection.remoteAddress);

        const sessionId = crypto.randomBytes(16).toString('hex');

        // If this fails, then the client must disconnect and reconnect
        socket.send({
            'type': 'connect_ack',
            'session_id': sessionId
        });
        
        // Add the session to the user map
        this._lobbyService.initUser(sessionId);

        socket.on('message', (msg) => {
            this._onMessage(socket, msg);
        });
    }

    _onMessage(socket, msg) {
        const data = JSON.parse(msg);
        if (!data) {
            console.log('<Error> Received bad data from socket connection: ', req.connection.remoteAddress);
            return;
        }
        if (!LDNResponse.validate(socket, data, ['type'])) return;
        this._handleRequest(socket, data);
        this._handleResponse(data);

    }

    _handleRequest(socket, data) {

        const payload = { type: data.type + '_ack' }

        if (data.type === 'create_lobby') {
            
            if (!LDNResponse.validateFields(socket, data, ['session_id'])) return;

            const sessionId = data.session_id;

            if (this._lobbyService.createLobby(socket, sessionId)) {
                payload.code = 1;
                payload.lobby_id = this._lobbyService.getLobbyId(sessionId);
            } else {
                payload.code = 0;
                payload.msg = 'Calling createLobby() failed.';
            }

        } else if (data.type === 'connect_lobby') {

            if (!LDNResponse.validateFields(socket, data, ['session_id', 'lobby_id'])) return;

            const sessionId = data.session_id;
            const lobbyId = data.lobby_id;
            const lobby = this._lobbyService.getLobby(lobbyId);

            if (!LDNResponse.validateLobby(socket, lobby, data)) return;

            if (this._lobbyService.connectLobby(socket, lobby, sessionId)) {
                payload.code = 1;
                payload.lobby_id = lobbyId;
            } else {
                payload.code = 0;
                payload.msg = 'Calling connectLobby() failed.';
            }

        } else if (data.type === 'start_control') {

            if (!LDNResponse.validateFields(socket, data, ['session_id'])) return;

            const sessionId = data.sessionId;
            const lobby = this._lobbyService.getLobbyFromSession(sessionId);
            if (!LDNResponse.validateLobby(socket, lobby, data)) return;
            // Todo: Authorize session id

            if (lobby.emitTask) {
                // Todo: Test/never reached
                lobby.stopEmitTask();
            }

            if (lobby.startEmitTask()) {
                payload.code = 1;
            }
            

        }
        socket.send(payload);
        return;
    }

    _handleResponse(data) {

        // These do not send a response, they just update server state
        if (data.type === 'update_ack') {
            // Todo: Handle server state update
        }
    }

    // ==============
    // Public Methods
    // ==============

    start() {
        if (this._server) this._server.close();
        this._start();
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