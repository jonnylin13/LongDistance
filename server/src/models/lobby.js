class Lobby {

    constructor(lobbyId, master) {
        this._id = lobbyId;
        this._master = master;
        this._slaves = {}; // X where X is the number of slaves
        this._emitTask = null;
    }

    _swapMaster(promoted) {
        this._master = promoted;
        this._removeSlave(promoted.sessionId);
    }

    _removeSlave(sessionId) {
        delete this._slaves[sessionId];
    }

    _removeMaster() {
        if (this.numSlaves >= 1) {
            const promoted = this._slaves[0];
            this._swapMaster(promoted);
            // There should no longer be a reference to the master User object
        } else {
            // If there are no slaves to pick from, then GG
            // Todo: Handle this in GC
            this._master = null;
        }
    }

    _isSlave(sessionId) {
        return sessionId in this._slaves;
    }

    _setMaster(promoted) {
        // Won't be used for awhile (maybe never)
        if (this._isSlave(promoted.sessionId)) {
            this._removeSlave(promoted.sessionId);
            // Set old master as slave
            const temp = this._master;
            this._master = promoted;
            this.addSlave(temp);
            return;
        }
        this._master = promoted;
    }

    get emitTask() {
        return this._emitTask;
    }

    get id() {
        return this._id;
    }

    get master() {
        return this._master;
    }

    get size() {
        return  this.numSlaves + (this.master === null ? 0 : 1);
    }

    get numSlaves() {
        return Object.keys(this._slaves).length;
    }

    addSlave(user) {
        if (this._master === user) {
            // Is this ever reached?
            if (this.numSlaves >= 1) {
                const promoted = this._slaves[0];
                this._swapMaster(promoted);
            }
        }
        this._slaves[user.sessionId] = user;
        // Check if lobby state needs to be updated?
    }

    removeUser(sessionId) {
        if (this._isSlave()) this._removeSlave(sessionId);
        else if (this.master.sessionid === sessionId) this._removeMaster();
    }

    emit(payload) {
        for (const sessionId in this._slaves) {
            const slave = this._slaves[sessionId];
            slave.send(payload);
        }
    }

    startEmitTask() {
        try {
            this._emitTask = setInterval(
                () => {
                    this.emit({
                        type: 'update_request'
                    });
                }, 
                ms=process.env.EMIT_DELAY);
            return true;
        } catch(e) {
            console.log(e);
            return false;
        }
        
    }

    stopEmitTask() {
        if (this._emitTask) {
            clearInterval(this._emitTask);
            this._emitTask = null;
        }
    }
}

module.exports = Lobby;