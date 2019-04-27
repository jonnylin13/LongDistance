import Constants from "../shared/constants";
import LDNClient from "./ldn";

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
      if (this._getLobbyIdText())
        this._getLobbyIdText().innerHTML = LDNClient.getInstance().user.lobbyId;
      console.log(LDNClient.getInstance().user.lobbyId);
    } else {
      if (this._getLobbyIdText()) this._getLobbyIdText().innerHTML = "";
    }
  }

  // =================
  // UI Button Methods
  // =================
  startLobbyClicked($event) {
    LDNClient.getInstance()
      .startLobby({
        type: Constants.Protocol.Messages.START_LOBBY,
        code: Constants.Protocol.SUCCESS
      })
      .then(() => {
        this._updateViewState(Constants.ViewState.IN_LOBBY);
      })
      .catch(() => {}); // TODO
  }

  disconnectLobbyClicked() {}

  connectClicked() {}

  connectConfirmClicked() {}

  connectBackClicked() {}
}

const popup = new Popup();
