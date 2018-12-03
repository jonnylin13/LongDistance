module.exports = class ServerProtocol {

    // Out
    static START_LOBBY_ACK(user=null) {
        const data = {
            'success': true,
            type: 'START_LOBBY_ACK'
        };
        if (user) data['user'] = user.toJson();
        else data['success'] = false;
        return JSON.stringify(data);
    }

    // In
    static START_LOBBY() {
        return null; // TODO
    }

    
}