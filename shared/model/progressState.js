module.exports = class ProgressState {
  constructor(elapsed = 0, duration = 0) {
    this.elapsed = elapsed;
    this.duration = duration;
  }

  static fromJson(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      return new ProgressState(data['elapsed'], data['duration']);
    } catch (err) {
      console.log(
        '<Error> Tried to instantiate progress state with corrupt data!'
      );
      return null;
    }
  }
};
