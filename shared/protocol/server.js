module.exports = class ServerProtocol {

    static START_LOBBY_ACK(lobby, success=true) {
        return JSON.stringify({
            'lobby': lobby,
            success: success,
            type: 'START_LOBBY_ACK'
        });
    }

    
}