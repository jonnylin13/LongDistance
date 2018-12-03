const Message = require('./generic/message');

module.exports = class StartLobbyAckMessage extends Message {

    constructor(code, user) {
        super('START_LOBBY_ACK', code);
        if (user) this.user = user.toJson();
    }
}