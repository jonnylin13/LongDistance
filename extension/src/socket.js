const Constants = require('./util/constants');

class SocketController {
    constructor(tabListener) {
        this._tabs = tabListener;
        this._ws = null;
        if (!this._connect()) {
            throw new Error('<LDN> Could not connect to WebSocket server!');
        }
    }

    _connect() {
        if (!this._socketOpen()) {
            try {
                this._ws = new WebSocket(Constants.WS_URL);
                this._ws.onopen = () => {
                    this._ws.onmessage = (msg) => {
                         this._handleMessage(msg);
                    };
                }

                this._ws.close = (event) => {
                    this._onClose();
                };
                return true;
            } catch (e) {
                console.log(e);
                return false;
            } 
        }
        return true;
    }

    _onClose(event) {
        // What is this for really?
        if (this._tabs.clientState.connectedToLobby()) {
            this._connect();
        }
    }

    _handleMessage(msg) {
        const data = JSON.parse(msg.data);


        console.log('<LDN> Socket received msg of type: ', data.type);

        this._handleRequest(data);
        this._handleResponse(data);
    }

    _handleResponse(data) {

        if (data.type === 'create_lobby_ack') {
            const lobbyId = data.lobbyId;
            this._tabs.clientState.lobbyId = lobbyId;
            chrome.tabs.sendMessage(this._tabs.tabId, {
                'type': 'start_lobby_ack',
                'lobbyId': lobbyId,
                'code': 1
            });
        } else if (data.type === 'connect_ack') {
            this._tabs.clientState.sessionId = data.session_id;
        }
    }

    _handleRequest(data) {
        // Todo
    }

    _socketOpen() {
        return this._ws !== null && this._ws.readyState === 4;
    }

    _send(json) {
        if (this._connect()) {
            this._ws.send(JSON.stringify(json));
        } else {
            // Todo: handle error
            return;
        }
    }

    createLobby() {
        if (this._tabs.clientState.sessionId === '') {
            console.log('<LDN> Tried to start a lobby with no session ID!');
            return;
        }
        this._send({'type': 'create_lobby', 'session_id': this._tabs.clientState.sessionId});
    }

    get tabListener() {
        return this._tabs;
    }
}

module.exports = SocketController;