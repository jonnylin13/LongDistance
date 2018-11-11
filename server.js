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
            this.start();
        }
    }

    start() {
        this.server = new WebSocket.Server({port: PORT});
        console.log('Listening on port: ', PORT);
        this.server.on('connection', this.onConnection);
    }

    contains(lobbyId) {
        return (lobbyId in this.lobbies);
    }

    add(lobby) {
        if (!this.contains(lobby.id)) this.lobbies[lobby.id] = lobby;
    }

    isConnected(userId) {
        for (user of this.users)
            if (user.id === userId) return true;
    }

    onConnection(socket) {

        console.log('Connection received from: ', req.connection.remoteAddress);
        socket.on('message', (msg) => {
            this.onMessage(socket, msg);
        });

    }

    onMessage(socket, from, msg) {

        const data = JSON.parse(msg);
        if (!data) {
            console.log('Server received janky JSON data!');
            return;
        }

        console.log('Received message with type: ', data.type);
        if (data.type == 'start_lobby') {
            this.startLobby(socket);
        }

    }

    startLobby(socket) {
        if (!data.user_id) {
            console.log('Tried to start a lobby without a user id!');
            return;
        }
        const userId = data.user_id;
        if (this.isConnected(userId)) {
            console.log('Error: user is already connected. ID: ', str(userId));
            return;
        }

        const lobbyId = short_id.generate();
        const user = User(lobbyId, userId, -1, '', ProgressState());
        const lobby = Lobby(lobbyId, user);
        this.add(lobby);
        this.socket.send(ServerProtocol.startLobbyAck(lobbyId, success=true));
        this.printLobbies();
    }

    printLobbies() {
        console.log('New lobby started!');
        console.log(this.lobbies)
    }

}

const ldnServer = new LDNServer(true);