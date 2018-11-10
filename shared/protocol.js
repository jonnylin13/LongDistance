

export class ServerProtocol {

    startLobbyAck(lobbyId, success=true) {
        return JSON.stringify({
            lobby_id: lobbyId,
            success: success,
            type: 'start_lobby_ack'
        });
    }

    
}

export class BackgroundProtocol {

    static ldnLoadedAck() {
        return {type: 'ldn_loaded_ack'};
    }
    
}