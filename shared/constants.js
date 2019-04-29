module.exports.ViewState = Object.freeze({
  IN_LOBBY: 1,
  OUT_LOBBY: 0,
  CONNECT_LOBBY: 2
});
module.exports.ControllerState = Object.freeze({
  INACTIVE: -1,
  PENDING: 0,
  PAUSE: 1,
  PLAY: 2
});
module.exports.Protocol = Object.freeze({
  SUCCESS: 1,
  FAIL: 0,
  Messages: {
    START_LOBBY: 'start_lobby',
    START_LOBBY_ACK: 'start_lobby_ack',
    DISCONNECT_LOBBY: 'disconnect_lobby',
    DISCONNECT_LOBBY_ACK: 'disconnect_lobby_ack',
    CONNECT_LOBBY: 'connect_lobby',
    CONNECT_LOBBY_ACK: 'connect_lobby_ack',
    UPDATE_URL: 'update_url',
    UPDATE_URL_ACK: 'update_url_ack',
    UPDATE_CONTROL: 'update_control',
    UPDATE_CONTROL_ACK: 'update_control_ack',
    UPDATE_TIME: 'update_time',
    UPDATE_TIME_ACK: 'update_time_ack',
    UPDATE_STATE: 'update_state',
    UPDATE_STATE_ACK: 'update_state_ack',
    GET_LOBBY_ID: 'get_lobby_id',
    GET_LOBBY_ID_ACK: 'get_lobby_id_ack',
    POPUP_LOADED: 'popup_loaded',
    POPUP_LOADED_ACK: 'popup_loaded_ack'
  }
});

module.exports.WS_URL = Object.freeze('ws://192.168.0.9:3000/');
