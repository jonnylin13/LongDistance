import Constants from '../../shared/constants';
import PopupLoadedAckMessage from '../../shared/protocol/background/popupLoadedAck';
import GetLobbyIdAckMessage from '../../shared/protocol/background/getLobbyIdAck';
import StartLobbyMessage from '../../shared/protocol/startLobby';


export default class LDNMessageListener {
    constructor (ldn) {
        this.ldn = ldn;
        chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
            this.onMessage(req, sender, sendResponse);
        });
    }

    onMessage (req, sender, sendResponse) {
        
        // TODO: Check implementation
        if (!req.type) {
            console.log('<Error> LDN background received a broken message from a content script.');
            console.log(req);
            return;
        }
        console.log('<Info> LDN background received message type: ', req.type);
        if (req.type === 'POPUP_LOADED') {
            this.wrappedSendResponse(sendResponse, (new PopupLoadedAckMessage(Constants.Codes.Protocol.SUCCESS)).toJson());
        } else if (req.type === 'GET_LOBBY_ID') {
            if (this.ldn.user.currentLobby) {
                this.wrappedSendResponse(sendResponse, (new GetLobbyIdAckMessage(Constants.Codes.Protocol.SUCCESS, this.user.currentLobby.id)).toJson());
            } else {
                this.wrappedSendResponse(sendResponse, (new GetLobbyIdAckMessage(Constants.Codes.Protocol.FAIL)));
            }
        } else if (req.type === 'START_LOBBY') {
            this.ldn.startLobby(StartLobbyMessage.fromJson(JSON.stringify(req))).then(result => {
                this.wrappedSendResponse(sendResponse, result);
            });
        }
    }

    wrappedSendResponse (sendResponse, data) {
        console.log('<Info> Sending the following response: ');
        console.log(data);
        sendResponse(data);
    }
}