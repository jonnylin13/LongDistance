module.exports = class ServerProtocol {

    startLobbyAck(lobbyId, success=true) {
        return JSON.stringify({
            lobby_id: lobbyId,
            success: success,
            type: 'start_lobby_ack'
        });
    }

    
}