class ProgressState {
    constructor(elapsed, total) {
        this.elapsed = elapsed;
        this.total = total;
    }

    getElapsed() {
        return this.elapsed;
    }

    getTotal() {
        return this.total;
    }
} 

class Lobby {
    constructor(id, controller) {
        this.id = id;
        this.controller = controller;
        this.users = {};
        this.add(this.controller);
    }

    contains(userId) {
        return (userId in this.users);
    }

    add(user) {
        if (!this.contains(user)) this.users[user.id] = user;
    }

    remove(user) {
        if (this.contains(user)) delete this.users[user.id];
    }
}

class User {
    constructor(lobbyId, id, state, urlParams, progressState) {
        this.lobbyId = lobbyId;
        this.id = id;
        this.state = state;
        this.urlParams = urlParams;
        this.progressState = progressState;
    }

}

 