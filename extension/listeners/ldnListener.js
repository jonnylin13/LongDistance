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

        const data = JSON.parse(req);
        
        if (!data.type) {
            console.log('<Error> LDN background received a broken message from a content script.');
            console.log(req);
            return;
        }
        console.log('<Info> LDN background received message type: ', data.type);
        if (data.type === 'POPUP_LOADED') {
            this.wrappedSendResponse(sendResponse, (new PopupLoadedAckMessage(Constants.Codes.Protocol.SUCCESS)).toJson());
        } else if (data.type === 'GET_LOBBY_ID') {
            if (this.ldn.user.currentLobby) {
                this.wrappedSendResponse(sendResponse, (new GetLobbyIdAckMessage(Constants.Codes.Protocol.SUCCESS, this.user.currentLobby.id)).toJson());
            } else {
                this.wrappedSendResponse(sendResponse, (new GetLobbyIdAckMessage(Constants.Codes.Protocol.FAIL)));
            }
        } else if (data.type === 'START_LOBBY') {
            // TODO: Fix this mess please
            this.ldn.startLobby(req).then(result => {
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