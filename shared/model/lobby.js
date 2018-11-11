module.exports = class Lobby {
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
