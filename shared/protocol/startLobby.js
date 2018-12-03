const Message = require('./generic/message');

module.exports = class StartLobbyMessage extends Message {

    constructor(code, userData) {
        super('START_LOBBY', code);
        this.userData = userData;
    }
}