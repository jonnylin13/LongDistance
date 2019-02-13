class User {
    constructor(sessionId, socket) {
        this._sessionId = sessionId;
        this._socket = socket;
    }

    get sessionId() {
        return this._sessionId;
    }

    send(payload) {
        this._socket.send(payload);
    }
}

module.exports = User;