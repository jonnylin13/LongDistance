Array.prototype.remove = function(val) {
  const i = this.indexOf(val);
  if (i !== -1) this.splice(i, 1);
};
