const Message = require('../generic/message');

module.exports = class GetLobbyIdAckMessage extends Message {

    constructor(code, lobbyId) {
        super('GET_LOBBY_ID_ACK', code);
        this.lobbyId = lobbyId;
    }
}