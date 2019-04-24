import Constants from "../shared/constants";
import Util from "../shared/util";

class Popup {
  constructor() {
    this.views = {};

    $().ready(() => {
      this.views[Constants.ViewState.IN_LOBBY] = $("#in-lobby-container");
      this.views[Constants.ViewState.OUT_LOBBY] = $("#out-lobby-container");
      this.views[Constants.ViewState.CONNECT_LOBBY] = $(
        "#connect-lobby-container"
      );

      $("#start-lobby-btn").on("click", this.startLobbyClicked);
      $("#disconnect-btn").on("click", this.disconnectLobbyClicked);
      $("#connect-btn").on("click", this.connectClicked);
      $("#connect-btn-back").on("click", this.connectBackClicked);
      $("#connect-confirm-btn").on("click", this.connectConfirmClicked);

      this._updateViewState(Constants.ViewState.OUT_LOBBY);
      chrome.runtime.sendMessage(
        JSON.stringify({
          type: Constants.Protocol.Messages.POPUP_LOADED,
          code: Constants.Protocol.SUCCESS
        }),
        response => {
          if (response.type === "POPUP_LOADED_ACK") {
            if (response.code === Constants.Protocol.SUCCESS) {
              // TODO: Handle
            }
          }
        }
      );
    });
  }

  // ===============
  // Private Methods
  // ===============
  _getLobbyIdText() {
    return $("#lobby-id-text");
  }

  _updateViewState(newState) {
    for (const state in this.views) {
      if (state == newState) this.views[state].appendTo("body");
      else this.views[state].detach();
    }

    if (newState == Constants.ViewState.IN_LOBBY) {
      chrome.runtime.sendMessage(
        JSON.stringify({
          type: Constants.Protocol.GET_LOBBY_ID,
          code: Constants.Protocol.SUCCESS
        }),
        response => {
          if (
            response.type == Constants.Protocol.Messages.GET_LOBBY_ID_ACK &&
            this._getLobbyIdText()
          )
            this._getLobbyIdText().innerHTML = response.lobbyId;
          // TODO: Handle default response
        }
      );
    } else {
      if (this._getLobbyIdText()) this._getLobbyIdText().innerHTML = "";
    }
  }

  // =================
  // UI Button Methods
  // =================
  startLobbyClicked($event) {
    chrome.runtime.sendMessage(
      JSON.stringify({
        type: Constants.Protocol.START_LOBBY,
        code: Constants.Protocol.Messages.SUCCESS
      }),
      response => {
        console.log(response);
        if (!Util.validateMessage(response)) {
          console.log("<Error> Popup received invalid response.");
          return false;
        }
        if (response.type === Constants.Protocol.Messages.START_LOBBY) {
          // IN PROGRESS: Implement
          // Update the view state to display lobby ID
          if (response.code === Constants.Protocol.SUCCESS) {
            this._updateViewState(Constants.ViewState.IN_LOBBY);
          } else {
            // TODO: Handle error
          }
        }
      }
    );
  }

  disconnectLobbyClicked() {}

  connectClicked() {}

  connectConfirmClicked() {}

  connectBackClicked() {}
}

const popup = new Popup();
