const Message = require('../generic/message');

module.exports = class PopupLoadedAckMessage extends Message {

    constructor(code) {
        super('POPUP_LOADED_ACK', code);
    }
}