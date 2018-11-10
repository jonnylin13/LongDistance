import { Lobby, User, ProgressState } from './shared/model';
import { ServerProtocol } from './shared/protocol';
import { short_id } from 'shortid';
import { io } from 'socket.io';

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
        this.server = new io(PORT, {path: PATH});
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
        socket.on('message', (from, msg) => {
            this.onMessage(socket, from, msg);
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

const ldnServer = LDNServer(start=true);