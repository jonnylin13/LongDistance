module.exports = class BackgroundProtocol {

    static ldnLoadedAck() {
        return {type: 'ldn_loaded_ack'};
    }
    
}