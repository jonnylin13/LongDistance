module.exports.ViewState = Object.freeze({
  IN_LOBBY: 1,
  OUT_LOBBY: 0,
  CONNECT_LOBBY: 2
});
module.exports.ControllerState = Object.freeze({
  INACTIVE: -1,
  IDLE: 0,
  PAUSE: 1,
  PLAY: 2
});
module.exports.Protocol = Object.freeze({
  SUCCESS: 1,
  FAIL: 0,
  Messages: {
    START_LOBBY: "start_lobby",
    START_LOBBY_ACK: "start_lobby_ack",
    DISCONNECT_LOBBY: "disconnect_lobby",
    GET_LOBBY_ID: "get_lobby_id",
    GET_LOBBY_ID_ACK: "get_lobby_id_ack",
    POPUP_LOADED: "popup_loaded",
    POPUP_LOADED_ACK: "popup_loaded_ack"
  }
});

module.exports.WS_URL = Object.freeze("ws://127.0.0.1:3000/");
