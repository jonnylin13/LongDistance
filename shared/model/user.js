const ProgressState = require('./progressState');

module.exports = class User {
  constructor(
    controllerState,
    urlParams,
    progressState,
    lobbyId = null,
    id = null,
    controller = false
  ) {
    this.lobbyId = lobbyId;
    this.id = id;
    this.controllerState = controllerState;
    this.urlParams = urlParams;
    this.progressState = progressState;
    this.controller = controller;
  }

  static fromJson(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      return new User(
        data['controllerState'],
        data['urlParams'],
        ProgressState.fromJson(JSON.stringify(data['progressState'])),
        data['lobbyId'],
        data['id'],
        data['controller']
      );
    } catch (err) {
      throw new Error(err);
    }
  }
};
