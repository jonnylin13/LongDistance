import Constants from '../shared/constants';
import BackgroundProtocol from '../shared/protocol/bg_protocol';
import Util from '../shared/util';


class Popup {

    constructor() {

        this.views = {};

        $().ready(() => {
            this.views[Constants.IN_LOBBY] = $('#in-lobby-container');
            this.views[Constants.OUT_LOBBY] = $('#out-lobby-container');
            this.views[Constants.CONNECT_LOBBY] = $('#connect-lobby-container');

            $('#start-lobby-btn').on('click', this.startLobbyClicked);
            $('#disconnect-btn').on('click', this.disconnectLobbyClicked);
            $('#connect-btn').on('click', this.connectClicked);
            $('#connect-btn-back').on('click', this.connectBackClicked);
            $('#connect-confirm-btn').on('click', this.connectConfirmClicked);
            chrome.runtime.sendMessage(BackgroundProtocol.POPUP_LOADED, (response) => {

            });
        });
        
    }

    getLobbyIdText() {
        return $('#lobby-id-text');
    }

    startLobbyClicked($event) {
        chrome.runtime.sendMessage(BackgroundProtocol.START_LOBBY, (response) => {
            if (!Util.validateMessage(response)) {
                console.log('<Error> Popup received invalid response.');
                return false;
            }
            if (response.type === 'START_LOBBY_ACK' && response.success) {
                
            }
        });
    }

    disconnectLobbyClicked() {

    }

    connectClicked() {

    }

    connectConfirmClicked() {

    }

    connectBackClicked() {

    }

    updatePopupState(newState) {
        
        // TODO: Do we need to update LDN with popup state?
        chrome.runtime.sendMessage(BackgroundProtocol.UPDATE_POPUP_STATE(newState), (response) => {

        });
    
        for (const state in this.views) {
            if (state == newState) this.views[state].appendTo('body');
            else this.views[state].detach();
        }
        
        if (newState == Constants.IN_LOBBY) {
            chrome.runtime.sendMessage(BackgroundProtocol.GET_LOBBY_ID, (response) => {
                if (response && response.lobbyId && this.getLobbyIdText()) this.getLobbyIdText().innerHTML = response.lobbyId;
                // Utility.default_response(response);
            });
        } else {
            if (this.getLobbyIdText()) this.getLobbyIdText().innerHTML = '';
        }
    }

    getLobbyId() {

    }
}

const popup = new Popup();