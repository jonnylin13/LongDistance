const expect = require('chai').expect;
const LDNServer = require('../../server/server');
const User = require('../../shared/model/user');
const Constants = require('../../shared/constants');
const ProgressState = require('../../shared/model/progressState');

let _data = null;
let socket = {
  send: msg => {
    const data = JSON.parse(msg);
    _data = data;
  }
};
const _user = new User();
const _user2 = new User();

describe('LDNServer#startLobby', () => {
  it('should return lobbyId and userId', () => {
    const msg = JSON.stringify({
      type: Constants.Protocol.Messages.START_LOBBY,
      user: JSON.stringify(_user)
    });
    LDNServer._onMessage(socket, msg);
    expect(_data).to.have.property('lobbyId');
    expect(_data).to.have.property('userId');
    _user.id = _data.userId;
    _user.lobbyId = _data.lobbyId;
    _data = null;
  });
});

describe('LDNServer#connectLobby', () => {
  it('should add a slave', () => {
    const msg = JSON.stringify({
      type: Constants.Protocol.Messages.CONNECT_LOBBY,
      user: JSON.stringify(_user2),
      lobbyId: _user.lobbyId
    });
    LDNServer._onMessage(socket, msg);
    expect(LDNServer.getLobby(_user.lobbyId).size()).to.equal(2);
    expect(_data).to.have.property('userId');
    _user2.id = _data.userId;
    _user2.lobbyId = _user.lobbyId;
    _data = null;
  });
});

describe('LDNServer#disconnectLobby', () => {
  it('should disconnect user and switch controller to user2', () => {
    // Todo
    const msg = JSON.stringify({
      type: Constants.Protocol.Messages.DISCONNECT_LOBBY,
      user: JSON.stringify(_user)
    });
    LDNServer._onMessage(socket, msg);
    expect(LDNServer.getLobby(_user.lobbyId).size()).to.equal(1);
    expect(LDNServer.getLobby(_user.lobbyId).contains(_user.id)).to.equal(
      false
    );
  });
});

describe('LDNServer#disconnectLobby with no users left', () => {
  it('should disconnect user2 and delete lobby', () => {
    const msg = JSON.stringify({
      type: Constants.Protocol.Messages.DISCONNECT_LOBBY,
      user: JSON.stringify(_user2)
    });
    LDNServer._onMessage(socket, msg);
    expect(_data.code).to.equal(Constants.Protocol.SUCCESS);
    expect(LDNServer.contains(_user2.lobbyId)).to.equal(false);
  });
});
