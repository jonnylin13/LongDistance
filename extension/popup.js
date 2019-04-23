import Constants from "../shared/constants";
import StartLobbyMessage from "../shared/protocol/startLobby";
import PopupLoadedMessage from "../shared/protocol/background/popupLoaded";
import PopupLoadedAckMessage from "../shared/protocol/background/popupLoadedAck";
import GetLobbyIdMessage from "../shared/protocol/background/getLobbyId";
import Util from "../shared/util";

class Popup {
  constructor() {
    this.views = {};

    $().ready(() => {
      this.views[Constants.Codes.ViewState.IN_LOBBY] = $("#in-lobby-container");
      this.views[Constants.Codes.ViewState.OUT_LOBBY] = $(
        "#out-lobby-container"
      );
      this.views[Constants.Codes.ViewState.CONNECT_LOBBY] = $(
        "#connect-lobby-container"
      );

      $("#start-lobby-btn").on("click", this.startLobbyClicked);
      $("#disconnect-btn").on("click", this.disconnectLobbyClicked);
      $("#connect-btn").on("click", this.connectClicked);
      $("#connect-btn-back").on("click", this.connectBackClicked);
      $("#connect-confirm-btn").on("click", this.connectConfirmClicked);

      this._updateViewState(Constants.Codes.ViewState.OUT_LOBBY);
      chrome.runtime.sendMessage(
        new PopupLoadedMessage(Constants.Codes.Protocol.SUCCESS).toJson(),
        response => {
          if (response.type === "POPUP_LOADED_ACK") {
            if (response.code === Constants.Codes.Protocol.SUCCESS) {
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

    if (newState == Constants.Codes.ViewState.IN_LOBBY) {
      chrome.runtime.sendMessage(
        new GetLobbyIdMessage(Constants.Codes.Protocol.SUCCESS).toJson(),
        response => {
          if (response.type == "GET_LOBBY_ID_ACK" && this._getLobbyIdText())
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
      new StartLobbyMessage(Constants.Codes.Protocol.SUCCESS).toJson(),
      response => {
        if (!Util.validateMessage(response)) {
          console.log("<Error> Popup received invalid response.");
          return false;
        }
        if (response.type === "START_LOBBY_ACK") {
          // IN PROGRESS: Implement
          // Update the view state to display lobby ID
          if (response.code === Constants.Codes.Protocol.SUCCESS) {
            this._updateViewState(Constants.Codes.ViewState.IN_LOBBY);
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
