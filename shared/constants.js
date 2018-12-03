module.exports = class Constants {

    Codes = {
        ViewState = {
            IN_LOBBY: 1,
            OUT_LOBBY: 0,
            CONNECT_LOBBY: 2
        },
        ControllerState = {
            INACTIVE: -1,
            IDLE: 0,
            PAUSE: 1,
            PLAY: 2
        },
        Protocol = {
            SUCCESS: 1,
            FAIL: 0
        }
    };
    WS_URL = '';

}