
const Constants = require('./constants');

class ViewState {
    constructor(views) {
        this._views = views;
        this.update(Constants.ViewState.OUT_LOBBY);
    }

    update(newState) {
        for (const state in this._views) {
            if (state == newState) {
                this._views[state].style.display = 'block';
            } else {
                this._views[state].style.display = 'none';
            }
        }

        if (newState == Constants.ViewState.IN_LOBBY) {
            // Set the lobby ID
        } else {
            const lobbyIdText = document.getElementById('lobby-id-text');
            if (lobbyIdText) lobbyIdText.innerHTML = '';
        }
    }
}

class PopupController {

    constructor(viewState) {
        this._viewState = viewState;
    }

    get viewState() {
        return this._viewState;
    }

    dispatchStartLobby() {

    }

    dispatchDisconnect() {

    }

    dispatchConnect() {

    }
    
    dispatchConnectConfirm() {

    }

    back() {

    }


}

document.addEventListener('DOMContentLoaded', popup);

function popup(event) {
    const views = [];
    views[Constants.ViewState.IN_LOBBY] = document.getElementById('in-lobby-container');
    views[Constants.ViewState.OUT_LOBBY] = document.getElementById('out-lobby-container');
    views[Constants.ViewState.CONNECT_LOBBY] = document.getElementById('connect-lobby-container');
    const viewState = new ViewState(views);
    const controller = new PopupController(viewState);
    document.getElementById('start-lobby-btn').addEventListener('onclick', controller.dispatchStartLobby);
    document.getElementById('disconnect-btn').addEventListener('onclick', controller.dispatchConnectConfirm);
    document.getElementById('connect-btn').addEventListener('onclick', controller.dispatchConnect);
    document.getElementById('connect-btn-back').addEventListener('onclick', controller.back);
    document.getElementById('connect-confirm-btn').addEventListener('onclick', controller.dispatchConnect);
}