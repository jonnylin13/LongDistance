module.exports = class ServerProtocol {

    static START_LOBBY_ACK(lobbyId, success=true) {
        return JSON.stringify({
            lobby_id: lobbyId,
            success: success,
            type: 'START_LOBBY_ACK'
        });
    }

    
}