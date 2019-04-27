const ProgressState = require("./progressState");

module.exports = class User {
  constructor(
    controllerState,
    urlParams,
    progressState,
    lobbyId = null,
    id = null
  ) {
    this.lobbyId = lobbyId;
    this.id = id;
    this.controllerState = controllerState;
    this.urlParams = urlParams;
    this.progressState = progressState;
  }

  static fromJson(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      return new User(
        data["controllerState"],
        data["urlParams"],
        ProgressState.fromJson(JSON.stringify(data["progressState"])),
        data["lobbyId"],
        data["id"]
      );
    } catch (err) {
      throw new Error(err);
    }
  }
};
