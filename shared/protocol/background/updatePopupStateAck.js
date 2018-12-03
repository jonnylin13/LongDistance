const Message = require('../generic/message');

module.exports = class UpdatePopupStateAckMessage extends Message {

    constructor(code) {
        super('UPDATE_POPUP_STATE_ACK', code);
    }
}