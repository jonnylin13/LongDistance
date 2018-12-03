const Message = require('./generic/message');

module.exports = class StartLobbyAckMessage extends Message {

    constructor(code, userData) {
        super('START_LOBBY_ACK', code);
        this.userData = userData;
    }
}