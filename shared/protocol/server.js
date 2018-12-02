module.exports = class ServerProtocol {

    // Out
    static START_LOBBY_ACK(lobby, success=true) {
        return JSON.stringify({
            'lobby': lobby,
            success: success,
            type: 'START_LOBBY_ACK'
        });
    }

    // In
    static START_LOBBY() {
        return null; // TODO
    }

    
}