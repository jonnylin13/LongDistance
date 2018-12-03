const StartLobbyMessage = require('./shared/protocol/startLobby');
const StartLobbyAckMessage = require('./shared/protocol/startLobbyAck');
const User = require('./shared/model/user');
const Constants = require('./shared/constants');

const startLobbyAck = new StartLobbyAckMessage(Constants.Codes.Protocol.SUCCESS, new User(null, null, null, null));
console.log((new StartLobbyMessage(Constants.Codes.Protocol.SUCCESS)).toJson());
console.log(startLobbyAck instanceof StartLobbyAckMessage);
console.log(StartLobbyAckMessage.fromJson(startLobbyAck.toJson()));