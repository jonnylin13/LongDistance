module.exports = class Lobby {
  constructor(id, controller, users = {}) {
    this.id = id;
    this.controller = controller;
    this.users = users;
    this.add(this.controller);

    console.log("<Lobby> New lobby created: " + this.id);
  }

  contains(user) {
    return user.id in this.users;
  }

  add(user) {
    if (!this.contains(user)) this.users[user.id] = user;
  }

  remove(user) {
    if (this.contains(user)) delete this.users[user.id];
    if (this.controller === user) {
      // Choose a different controller
      if (this.size() > 0) this.controller = this.users[0];
      else this.controller = null;
    }
  }

  size() {
    return this.users.size();
  }

  static fromJson(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      return new Lobby(data["id"], data["controller"], data["users"]);
    } catch (err) {
      console.log("<Error> Tried to instantiate lobby with corrupt data!");
      return null;
    }
  }
};
