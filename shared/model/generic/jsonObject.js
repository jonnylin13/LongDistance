module.exports = class JsonObject {

    toJson() {
        const data = {};
        for (const member in this) {
            if (this.hasOwnProperty(member)) {
                if (this[member] instanceof JsonObject) {
                    data[member] = this[member].toJson();
                } else {
                    data[member] = this[member];
                }
            }
        }
        return JSON.stringify(data);
    }

    updateFromJson(jsonString) {
        const data = JSON.parse(jsonString);
        for (const member in this) {
            if (this.hasOwnProperty(member) && member in data) {
                if (this[member] instanceof JsonObject) {
                    this[member].updateFromJson(data[member]);
                } else {
                    this[member] = data[member]
                }
            }
        }
    }

    static fromJson(jsonString) {
        throw new Error('<Error> Tried to call fromJson() but it has not been implemented!');
    }
}