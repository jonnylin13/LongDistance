import Constants from "../shared/constants";

// NOT PERSISTENT
class Popup {
  constructor() {
    this.views = {};
    $().ready(() => {
      this.views[Constants.ViewState.IN_LOBBY] = $("#in-lobby-container");
      this.views[Constants.ViewState.OUT_LOBBY] = $("#out-lobby-container");
      this.views[Constants.ViewState.CONNECT_LOBBY] = $(
        "#connect-lobby-container"
      );

      $("#start-lobby-btn").on("click", event => this.startLobbyClicked(event));
      $("#disconnect-btn").on("click", event =>
        this.disconnectLobbyClicked(event)
      );
      $("#connect-btn").on("click", event => this.connectClicked(event));
      $("#connect-btn-back").on("click", event =>
        this.connectBackClicked(event)
      );
      $("#connect-confirm-btn").on("click", event =>
        this.connectConfirmClicked(event)
      );
      console.log(this._getLDNClientInstance());
      if (this._getLDNClientInstance().user.lobbyId !== null)
        this._updateViewState(Constants.ViewState.IN_LOBBY);
      else this._updateViewState(Constants.ViewState.OUT_LOBBY);
    });
  }

  // ===============
  // Private Methods
  // ===============

  // Popup script is not persistent, or run in the same context
  // So we cannot use LDNClient.getInstance()
  _getLDNClientInstance() {
    return chrome.extension.getBackgroundPage().ldn;
  }

  _getLobbyIdText() {
    return $("#lobby-id-text")[0];
  }

  _updateViewState(newState) {
    console.log("<Popup> Updating view state: " + newState);
    for (const state in this.views) {
      if (state == newState) this.views[state].appendTo("body");
      else this.views[state].detach();
    }

    if (newState == Constants.ViewState.IN_LOBBY) {
      if (this._getLobbyIdText())
        this._getLobbyIdText().innerHTML = this._getLDNClientInstance().user.lobbyId;
    } else {
      if (this._getLobbyIdText()) this._getLobbyIdText().innerHTML = "";
    }
  }

  // =================
  // UI Button Handlers
  // =================
  startLobbyClicked(event) {
    this._getLDNClientInstance()
      .startLobby({
        type: Constants.Protocol.Messages.START_LOBBY
      })
      .then(() => {
        this._updateViewState(Constants.ViewState.IN_LOBBY);
      })
      .catch(err => {
        console.log(err);
      });
  }

  disconnectLobbyClicked(event) {
    this._getLDNClientInstance().disconnectLobby({
      type: Constants.Protocol.Messages.DISCONNECT_LOBBY
    });
    this._updateViewState(Constants.ViewState.OUT_LOBBY);
  }

  connectClicked() {
    this._updateViewState(Constants.ViewState.CONNECT_LOBBY);
  }

  connectConfirmClicked(event) {
    this._getLDNClientInstance()
      .connectLobby({
        type: Constants.Protocol.Messages.CONNECT_LOBBY
      })
      .then(() => {
        this._updateViewState(Constants.ViewState.IN_LOBBY);
      })
      .catch(err => {
        console.log(err);
      });
  }

  connectBackClicked(event) {
    this._updateViewState(Constants.ViewState.OUT_LOBBY);
  }
}

const popup = new Popup();
