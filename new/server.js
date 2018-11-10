import { WebSocket } from 'ws';
import { Lobby, User, ProgressState } from './shared/model';
import { ServerProtocol } from './shared/protocol';
import { short_id } from 'shortid';

const PORT = 3000;
const PATH = '/ldn';

class LDNServer {

    constructor() {
        this.lobbies = {}
        this.wss = new WebSocket.Server({port: PORT, path: PATH});
        this.wss.on('connection', this.onConnection);
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

    onConnection(ws, req) {

        console.log('Connection received from: ', req.connection.remoteAddress);
        this.ws = ws;
        ws.on('message', this.onMessage);

    }

    onMessage(msg) {

        const data = JSON.parse(msg);
        if (!data) {
            console.log('Server received janky JSON data!');
            return;
        }

        console.log('Received message with type: ', data.type);
        if (data.type == 'start_lobby') {
            this.startLobby();
        }

    }

    startLobby() {
        if (!data.user_id) {
            console.log('Tried to start a lobby without a user id!');
            return;
        }
        if (!this.ws) {
            console.log('Tried to start a lobby without a connection!');
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
        this.ws.send(ServerProtocol.startLobbyAck(lobbyId, success=true));
        this.printLobbies();
    }

    printLobbies() {
        console.log('New lobby started!');
        console.log(this.lobbies)
    }

}