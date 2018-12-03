import Constants from '../../shared/constants';
import PopupLoadedAckMessage from '../../shared/protocol/background/popupLoadedAck';
import GetLobbyIdAckMessage from '../../shared/protocol/background/getLobbyIdAck';

export default class LDNMessageListener {
    constructor (ldn) {
        this.ldn = ldn;
        chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
            this.message(req, sender, sendResponse);
        });
    }

    message (req, sender, sendResponse) {
        if (!req.type) {
            console.log('<Error> LDN background received a broken message from a content script.');
            return;
        }
        
        // TODO: Check implementation
        console.log('<Info> LDN background received message type: ', req.type);
        if (req.type === 'POPUP_LOADED') {
            this.wrappedSendResponse(sendResponse, new PopupLoadedAckMessage(Constants.Codes.Protocol.SUCCESS));
        } else if (req.type === 'UPDATE_POPUP_STATE') {
            // this.wrappedSendResponse(sendResponse, (new UpdatePopupStateMessage(Constants.Protocol.SUCCESS, this.ldn.viewState)).toJson());
        } else if (req.type === 'GET_LOBBY_ID') {
            if (this.ldn.currentLobby) {
                this.wrappedSendResponse(sendResponse, new GetLobbyIdAckMessage(this.ldn.currentLobby.id));
            }
        } else if (req.type === 'START_LOBBY') {

        }
    }

    wrappedSendResponse (sendResponse, data) {
        console.log('<Info> Sending the following response: ');
        console.log(data);
        sendResponse(data);
    }
}