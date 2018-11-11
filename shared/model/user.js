module.exports = class User {
    constructor(lobbyId, id, state, urlParams, progressState) {
        this.lobbyId = lobbyId;
        this.id = id;
        this.state = state;
        this.urlParams = urlParams;
        this.progressState = progressState;
    }

}