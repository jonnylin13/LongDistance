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
const _user = new User(
  Constants.ControllerState.INACTIVE,
  "",
  new ProgressState()
);

describe("LDNServer#startLobby", () => {
  it("should return lobbyId and userId", () => {
    const msg = JSON.stringify({
      type: Constants.Protocol.Messages.START_LOBBY,
      user: JSON.stringify(_user)
    });
    LDNServer._onMessage(socket, msg);
    expect(_data).to.have.property("lobbyId");
    expect(_data).to.have.property("userId");
    _user.id = _data.userId;
    _user.lobbyId = _data.lobbyId;
  });
});

describe("LDNServer#connectLobby", () => {
  it("should add a slave", () => {
    // Todo
  });
});

describe("LDNServer#disconnectLobby", () => {
  it("should disconnect user", () => {
    // Todo
  });
});

describe("LDNServer#disconnectLobby with no users left", () => {
  it("should disconnect user and delete lobby", () => {
    const msg = JSON.stringify({
      type: Constants.Protocol.Messages.DISCONNECT_LOBBY,
      user: JSON.stringify(_user)
    });
    LDNServer._onMessage(socket, msg);
    expect(_data.code).to.equal(Constants.Protocol.SUCCESS);
    expect(LDNServer.contains(_user.lobbyId)).to.equal(false);
    _user.lobbyId = null;
  });
});
