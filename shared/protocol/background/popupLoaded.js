const Message = require('../generic/message');

module.exports = class PopupLoadedMessage extends Message {

    constructor(code) {
        super('POPUP_LOADED', code);
    }
}