module.exports = class BackgroundProtocol {

    // Out
    ldnLoadedAck() {
        return {type: 'ldn_loaded_ack'};
    }

    startLobbyAck() {
        return {type: 'start_lobby_ack'};
    }

    // In
    startLobby() {
        return {type: 'start_lobby'};
    }

    

    
    
}