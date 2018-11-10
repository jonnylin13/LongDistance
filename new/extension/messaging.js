import { BackgroundProtocol } from '../shared/protocol';

class BackgroundMessageListener {
    constructor () {
        chrome.runtime.onMessage.addListener(this.message);
    }

    message(req, sender, sendResponse) {
        if (!req.type) {
            console.log('LDN received a strange message from content script.');
            return;
        }

        console.log('LDN received message type: ', str(req.type));
        if (req.type === 'ldn_opened') {
            sendResponse(BackgroundProtocol.ldnOpenedAck());
        }
    }
}