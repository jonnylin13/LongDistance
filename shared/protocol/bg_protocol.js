module.exports = class BackgroundProtocol {

    // Out
    static get POPUP_LOADED_ACK () {
        return {type: 'POPUP_LOADED_ACK'};
    }

    static get START_LOBBY_ACK () {
        return {type: 'START_LOBBY_ACK'};
    }

    static UPDATE_POPUP_STATE_ACK (success=true) {
        return {
            type: 'UPDATE_POPUP_STATE_ACK',
            success: success
        };
    }

    static GET_LOBBY_ID_ACK(lobbyId) {
        return {
            type: 'GET_LOBBY_ID_ACK',
            lobbyId: lobbyId
        }
    }

    // In
    static get POPUP_LOADED() {
        return {type: 'POPUP_LOADED'};
    }
    static get START_LOBBY() {
        return {type: 'START_LOBBY'};
    }

    static UPDATE_POPUP_STATE(popupState) {
        return {
            type: 'UPDATE_POPUP_STATE',
            'popupState': popupState
        };
    }

    static get GET_LOBBY_ID () {
        return {type: 'GET_LOBBY_ID'};
    }

    

    
    
}