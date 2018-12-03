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

    isConnected(user) {
        for (lobbyId in this.lobbies) {
            const lobby = this.lobbies[lobbyId];
            if (lobby.contains(user)) {
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
        if (!data.user) {
            console.log('<Error> Tried to start a lobby without a user!');
            return;
        }
        

        const lobbyId = short_id.generate();
        const user = User.fromJson(data.user);
        if (this.isConnected(user)) {
            console.log('<Error> User is already connected. ID: ', str(user.id));
            return;
        }
        const lobby = Lobby(lobbyId, user);
        this.addLobby(lobby);
        this.socket.send(ServerProtocol.startLobbyAck(user));
        this.printLobbies();
    }

    printLobbies() {
        console.log('<Info> New lobby information:');
        console.log(this.lobbies)
    }

}

const ldnServer = new LDNServer(true);