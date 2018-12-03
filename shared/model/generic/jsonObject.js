module.exports =  class JsonObject {

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

    update(jsonString) {
        const data = JSON.parse(jsonString);
        for (const member in this) {
            if (this.hasOwnProperty(member)) {
                if (member in data) {
                    if (this[member] instanceof JsonObject) {
                        // Implementation specific
                    } else {
                        this[member] = data[member]
                    }
                }
            }
        }
    }

    static fromJson(jsonString) {
        throw new Error('<Error> Tried to call fromJson() but it has not been implemented!');
    }
}