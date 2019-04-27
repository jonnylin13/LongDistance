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
    try {
      const data = JSON.parse(jsonString);
      return new User(
        data["id"],
        data["controllerState"],
        data["urlParams"],
        ProgressState.fromJson(JSON.stringify(data["progressState"])),
        data["lobbyId"]
      );
    } catch (err) {
      console.log("<Error> Tried to instantiate user with corrupt data!");
      return null;
    }
  }
};
