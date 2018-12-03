const Message = require('../generic/message');

module.exports = class UpdatePopupStateMessage extends Message {

    constructor(code, viewState) {
        super('UPDATE_POPUP_STATE', code);
        this.viewState = viewState;
    }
}