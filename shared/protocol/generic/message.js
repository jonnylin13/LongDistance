const JsonObject = require("../../model/generic/jsonObject");

module.exports = class Message extends JsonObject {
  constructor(type, code) {
    super();
    this.type = type;
    this.code = code;
  }

  static fromJson(jsonString) {
    console.log(
      "<Info> Instantiating a message from JSON with generic implementation!"
    );
    const data = JSON.parse(jsonString);
    if (!("type" in data) || !("code" in data)) {
      console.log(
        "<Error> Tried to instantiate a message from JSON with corrupt data!"
      );
      return null;
    }
    return new Message(data["type"], data["code"]);
  }

  static type() {
    return this.type;
  }
};
