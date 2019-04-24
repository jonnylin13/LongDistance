const expect = require("chai").expect;
const Util = require("../../shared/util");

describe("Util#v4", () => {
  it("should return a UUIDv4 token character of length 4", () => {
    expect(Util.v4().length).to.equal(4);
  });
});

describe("Util#uuidv4", () => {
  it("should return a UUIDv4 string", () => {
    expect(Util.uuidv4().length).to.equal(36);
  });
});
