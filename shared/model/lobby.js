const JsonObject = require('./generic/jsonObject');

module.exports = class Lobby extends JsonObject {
    constructor(id, controller, users={}) {
        this.id = id;
        this.controller = controller;
        this.users = users;
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

    static fromJson(jsonString) {
        const data = JSON.parse(jsonString);
        if (!('id' in data) || !('controller' in data) || !('users' in data)) {
            console.log('<Error> Tried to instantiate lobby with corrupt data!');
            return null;
        }
        return new User(data['id'], data['controller'], data['users']);
    }
}
