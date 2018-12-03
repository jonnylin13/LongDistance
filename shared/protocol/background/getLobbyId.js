const Message = require('../generic/message');

module.exports = class GetLobbyIdMessage extends Message {

    constructor(code) {
        super('GET_LOBBY_ID', code);
    }
}