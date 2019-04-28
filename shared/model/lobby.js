module.exports = class Lobby {
  constructor(id, controller, users = {}) {
    this.id = id;
    this.controllerId = controller.id;
    this.users = users;
    this.add(controller);
    console.log('<Lobby> New lobby created: ' + this.id);
  }

  contains(user) {
    return user.id in this.users;
  }

  add(user) {
    if (!this.contains(user)) this.users[user.id] = user;
  }

  remove(user) {
    if (this.contains(user)) delete this.users[user.id];
    if (this.controllerId === user.id) {
      // Choose a different controller
      if (this.size() > 0) this.controllerId = this.users[0].id;
      else this.controllerId = null;
    }
  }

  size() {
    return Object.keys(this.users).length;
  }

  static fromJson(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      return new Lobby(data['id'], data['controller'], data['users']);
    } catch (err) {
      console.log('<Error> Tried to instantiate lobby with corrupt data!');
      return null;
    }
  }
};
