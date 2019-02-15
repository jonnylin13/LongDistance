var Constants = require('../util/constants');

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

module.exports = ViewState;