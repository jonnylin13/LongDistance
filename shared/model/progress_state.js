module.exports = class ProgressState {
    constructor(elapsed, total) {
        this.elapsed = elapsed;
        this.total = total;
    }

    getElapsed() {
        return this.elapsed;
    }

    getTotal() {
        return this.total;
    }
} 