const Lobby = require('./shared/model/lobby');
const User = require('./shared/model/user');
const ProgressState = require('./shared/model/progress_state');
const ServerProtocol = require('./shared/protocol/server_protocol');
const short_id = require('shortid');
const WebSocket = require('ws');

const PORT = 3000;
const PATH = '/ldn';

class LDNServer {

    constructor(start=true) {
        this.lobbies = {}
        if (start) {
            this._start();
        }
    }

    start() {
        this.server = new WebSocket.Server({port: PORT});
        console.log('<Info> Listening on port: ', PORT);
        this.server.on('connection', this.onConnection);
    }

    contains(lobbyId) {
        return (lobbyId in this.lobbies);
    }

    addLobby(lobby) {
        if (!this.contains(lobby.id)) this.lobbies[lobby.id] = lobby;
    }

    isConnected(userId) {
        for (lobbyId in this.lobbies) {
            const lobby = this.lobbies[lobbyId];
            if (lobby.contains(userId)) {
                return true;
            }
        }
        return false;
    }

    onConnection(socket) {

        console.log('<Info> Connection received from: ', req.connection.remoteAddress);
        socket.on('message', (msg) => {
            this.onMessage(socket, msg);
        });

    }

    onMessage(socket, from, msg) {

        const data = JSON.parse(msg);
        if (!data) {
            console.log('<Error> Server received janky JSON data!');
            return;
        }

        console.log('<Info> received message with type: ', data.type);
        if (data.type == 'start_lobby') {
            this.startLobby(socket);
        }

    }

    startLobby(socket) {
        if (!data.user_id) {
            console.log('<Error> Tried to start a lobby without a user id!');
            return;
        }
        const userId = data.user_id;
        if (this.isConnected(userId)) {
            console.log('<Error> User is already connected. ID: ', str(userId));
            return;
        }

        const lobbyId = short_id.generate();
        const user = User(lobbyId, userId, -1, '', ProgressState());
        const lobby = Lobby(lobbyId, user);
        this.addLobby(lobby);
        this.socket.send(ServerProtocol.startLobbyAck(lobby.toJson(), success=true));
        this.printLobbies();
    }

    printLobbies() {
        console.log('<Info> New lobby information:');
        console.log(this.lobbies)
    }

}

const ldnServer = new LDNServer(true);