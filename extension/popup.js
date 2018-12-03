import Constants from '../shared/constants';
import StartLobbyMessage from '../shared/protocol/startLobby';
import StartLobbyMessageAck from '../shared/protocol/startLobbyAck';
import PopupLoadedMessage from '../shared/protocol/background/popupLoaded';
import GetLobbyIdMessage from '../shared/protocol/background/getLobbyId';
import GetLobbyIdAckMessage from '../shared/protocol/background/getLobbyIdAck';
import Util from '../shared/util';


class Popup {

    constructor() {

        this.views = {};

        $().ready(() => {
            this.views[Constants.Codes.ViewState.IN_LOBBY] = $('#in-lobby-container');
            this.views[Constants.Codes.ViewState.OUT_LOBBY] = $('#out-lobby-container');
            this.views[Constants.Codes.ViewState.CONNECT_LOBBY] = $('#connect-lobby-container');

            $('#start-lobby-btn').on('click', this.startLobbyClicked);
            $('#disconnect-btn').on('click', this.disconnectLobbyClicked);
            $('#connect-btn').on('click', this.connectClicked);
            $('#connect-btn-back').on('click', this.connectBackClicked);
            $('#connect-confirm-btn').on('click', this.connectConfirmClicked);
            chrome.runtime.sendMessage(new PopupLoadedMessage(Constants.Codes.Protocol.SUCCESS), (response) => {

            });
        });
        
    }

    getLobbyIdText() {
        return $('#lobby-id-text');
    }

    startLobbyClicked($event) {
        chrome.runtime.sendMessage(new StartLobbyMessage(Constants.Codes.Protocol.SUCCESS), (response) => {
            if (!Util.validateMessage(response)) {
                console.log('<Error> Popup received invalid response.');
                return false;
            }
            if (response instanceof StartLobbyMessageAck) {
                // TODO: Implement
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

    updateViewState(newState) {
        
        // TODO: Do we need to update LDN with popup state?
        /** chrome.runtime.sendMessage(BackgroundProtocol.UPDATE_POPUP_STATE(newState), (response) => {

        });**/
    
        for (const state in this.views) {
            if (state == newState) this.views[state].appendTo('body');
            else this.views[state].detach();
        }

        if (newState == Constants.Codes.ViewState.IN_LOBBY) {
            chrome.runtime.sendMessage(new GetLobbyIdMessage(Constants.Codes.Protocol.SUCCESS), (response) => {
                if (response instanceof GetLobbyIdAckMessage && this.getLobbyIdText()) this.getLobbyIdText().innerHTML = response.lobbyId;
                // TODO: Handle default response
            });
        } else {
            if (this.getLobbyIdText()) this.getLobbyIdText().innerHTML = '';
        }
    }

    getLobbyId() {

    }
}

const popup = new Popup();