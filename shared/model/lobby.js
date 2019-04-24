module.exports = class Lobby {
  constructor(id, controller, users = {}) {
    this.id = id;
    this.controller = controller;
    this.users = users;
    this.add(this.controller);
  }

  contains(user) {
    return user.id in this.users;
  }

  add(user) {
    if (!this.contains(user)) this.users[user.id] = user;
  }

  remove(user) {
    if (this.contains(user)) delete this.users[user.id];
  }

  size() {
    return this.users.size();
  }

  static fromJson(jsonString) {
    const data = JSON.parse(jsonString);
    if (!("id" in data) || !("controller" in data) || !("users" in data)) {
      console.log("<Error> Tried to instantiate lobby with corrupt data!");
      return null;
    }
    return new Lobby(data["id"], data["controller"], data["users"]);
  }
};
