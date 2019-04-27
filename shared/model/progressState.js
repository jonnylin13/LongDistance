module.exports = class ProgressState {
  constructor(elapsed = 0, total = 0) {
    this.elapsed = elapsed;
    this.total = total;
  }

  getElapsed() {
    return this.elapsed;
  }

  getTotal() {
    return this.total;
  }

  static fromJson(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      return new ProgressState(data["elapsed"], data["total"]);
    } catch (err) {
      console.log(
        "<Error> Tried to instantiate progress state with corrupt data!"
      );
      return null;
    }
  }
};
