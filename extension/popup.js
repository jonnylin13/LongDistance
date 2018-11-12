import { Constants } from '../shared/constants';
import { BackgroundProtocol } from '../shared/protocol/bg_protocol';


class Popup {

    constructor() {
        this.views = {};
        this.views[Constants.InLobby] = $('#in-lobby-container');
        this.views[Constants.OutLobby] = $('#out-lobby-container');
        this.views[Constants.ConnectLobby] = $('#connect-lobby-container');

        $('#start-lobby-btn').on('click', this.startLobbyClicked);
        $('#disconnect-btn').on('click', this.disconnectLobbyClicked);
        $('#connect-btn').on('click', this.connectClicked);
        $('#connect-btn-back').on('click', this.connectBackClicked);
        $('#connect-confirm-btn').on('click', this.connectConfirmClicked);
    }

    startLobbyClicked($event) {
        chrome.runtime.sendMessage(BackgroundProtocol.startLobby(), (response) => {

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

    updateState(newState) {
        /** chrome.runtime.sendMessage({
            'type': 'update_popup_state',
            'new_state': newState
        }, Utility.default_response);*/
    
        for (const state in this.views) {
            if (state == newState) views[state].appendTo('body');
            else views[state].detach();
        }
    
        if (newState == Constants.InLobby) {
            chrome.runtime.sendMessage({
                'type': 'get_lobby_id'
            }, (response) => {
                // if (response && response.success && get_lobby_id_text()) get_lobby_id_text().innerHTML = response.lobby_id;
                // Utility.default_response(response);
            });
        } else {
            // if (get_lobby_id_text()) get_lobby_id_text().innerHTML = '';
        }
    }
}

const popup = new Popup();