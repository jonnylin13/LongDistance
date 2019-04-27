const expect = require("chai").expect;
const LDNServer = require("../server");
const User = require("../shared/model/user");
const Constants = require("../shared/constants");
const ProgressState = require("../shared/model/progressState");

let _data = null;
let socket = {
  send: msg => {
    const data = JSON.parse(msg);
    _data = data;
  }
};

describe("LDNServer#startLobby", () => {
  it("should return lobbyId and userId", () => {
    const _user = new User(
      Constants.ControllerState.INACTIVE,
      "",
      new ProgressState()
    );
    const msg = JSON.stringify({
      type: Constants.Protocol.Messages.START_LOBBY,
      user: JSON.stringify(_user)
    });
    LDNServer._onMessage(socket, msg);
    expect(_data).to.have.property("lobbyId");
    expect(_data).to.have.property("userId");
  });
});
