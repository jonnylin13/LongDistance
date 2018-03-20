
export class Utility {

    /** Generates UUIDv4 token character 
     * https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    */
    static v4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    /** Generates a UUIDv4 compliant random UUID */
    static uuidv4() {
        return this.v4() + this.v4() + '-' + this.v4() + '-' + this.v4() + '-' + this.v4() + '-' + this.v4() + this.v4() + this.v4();
    }

    static default_response(response) {
        if (response && response.type) console.log(response.type);
    }

}