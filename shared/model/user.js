const ProgressState = require("./progressState");

module.exports = class User {
  constructor(id, controllerState, urlParams, progressState, lobbyId = null) {
    this.lobbyId = lobbyId;
    this.id = id;
    this.controllerState = controllerState;
    this.urlParams = urlParams;
    this.progressState = progressState;
  }

  static fromJson(jsonString) {
    const data = JSON.parse(jsonString);
    if (
      !("lobbyId" in data) ||
      !("id" in data) ||
      !("controllerState" in data) ||
      !("urlParams" in data) ||
      !("progressState" in data)
    ) {
      console.log("<Error> Tried to instantiate user with corrupt data!");
      return null;
    }
    return new User(
      data["lobbyId"],
      data["id"],
      data["controllerState"],
      data["urlParams"],
      ProgressState.fromJson(JSON.stringify(data["progressState"]))
    );
  }
};
