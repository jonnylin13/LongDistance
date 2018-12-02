const JsonObject = require('./generic/jsonObject');
const ProgressState = require('./progressState');

module.exports = class User extends JsonObject {
    constructor(lobbyId, id, state, urlParams, progressState) {
        this.lobbyId = lobbyId;
        this.id = id;
        this.state = state;
        this.urlParams = urlParams;
        this.progressState = progressState;
    }

    static fromJson(jsonString) {
        const data = JSON.parse(jsonString);
        if (!('lobbyId' in data) || !('id' in data) || !('state' in data) || !('urlParams' in data) || !('progressState' in data)) {
            console.log('<Error> Tried to instantiate user with corrupt data!');
            return null;
        }
        return new User(data['lobbyId'], data['id'], data['state'], data['urlParams'], ProgressState.fromJson(JSON.stringify(data['progressState'])));
    }

}