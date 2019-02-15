class ClientState {
    constructor() {
        this.urlParams = '';
        this.lobbyId = '';
        this.sessionId = '';
        this.master = false;
    }

    connectedToLobby() {
        return this.lobbyId !== '' && this.sessionId;
    }

}

module.exports = ClientState;