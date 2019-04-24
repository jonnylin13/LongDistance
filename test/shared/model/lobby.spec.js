const expect = require("chai").expect;
const Lobby = require("../../../shared/model/lobby");

describe("Lobby#constructor", () => {
  it("should return a lobby object", () => {
    const lobby = new Lobby(1, { id: 2 });
    expect(lobby).to.be.an("object");
    expect(lobby).to.have.property("contains");
    expect(lobby).to.have.property("add");
    expect(lobby).to.have.property("remove");
  });
});

describe("Lobby#contains", () => {
  it("should contain user id 2", () => {
    const lobby = new Lobby(1, { id: 2 });
    expect(lobby.contains({ id: 2 })).to.equal(true);
    expect(lobby.contains({ id: 3 })).to.equal(false);
  });
});
