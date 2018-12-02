module.exports =  class JsonObject {

    toJson() {
        const data = {};
        for (const member in this) {
            if (this.hasOwnProperty(member)) {
                data[member] = this[member];
            }
        }
        return JSON.stringify(data);
    }

    static fromJson(data) {
        throw new Error('<Error> Tried to call fromJson() but it has not been implemented!');
    }
}