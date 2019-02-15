class Constants {

    static get ViewState() {
        return {
            IN_LOBBY: 0,
            OUT_LOBBY: 1,
            CONNECT_LOBBY: 2
        };
    }

    static get WS_URL() {
        return 'ws://127.0.0.1:3000';
    }

}
module.exports = Constants;