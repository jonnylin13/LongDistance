module.exports = class Constants {

    static get Codes() {
        return {
            ViewState: {
                IN_LOBBY: 1,
                OUT_LOBBY: 0,
                CONNECT_LOBBY: 2
            },
            ControllerState: {
                INACTIVE: -1,
                IDLE: 0,
                PAUSE: 1,
                PLAY: 2
            },
            Protocol: {
                SUCCESS: 1,
                FAIL: 0
            }
        };
    }

    static get WS_URL() {
        return 'ws://127.0.0.1:3000/';
    }

}