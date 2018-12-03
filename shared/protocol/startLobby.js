const Message = require('./generic/message');

module.exports = class StartLobbyMessage extends Message {

    constructor(code) {
        super('START_LOBBY', code);
    }
}