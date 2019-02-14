class Response {
    static validateFields(socket, data, fields) {
        for (const field in fields) {
            if (!data[field]) { 
                socket.send({ type: data.type + '_ack', msg: 'Missing field(s).', code: -1 });
                return false;
            }
        }
        return true;
    }

    static validateLobby(socket, lobby, data) {
        if (!lobby) {
            socket.send({ type: data.type + '_ack', msg: 'Lobby not found.', code: -2 });
            return false;
        }
        return true;
    }
}

module.exports = Response;