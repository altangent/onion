import { expect } from "chai";
import { forward } from "./exercise2_forward";
import * as fixture from "./fixtures";

describe("part3, exercise 2 - forward", () => {
  it("first node forwards to second node", () => {
    const result = forward(fixture.packet1);
    expect(result.toString("hex")).to.equal(fixture.rawPacket2.toString("hex"));
  });

  it("second node forwards to third node", () => {
    const result = forward(fixture.packet2);
    expect(result.toString("hex")).to.equal(fixture.rawPacket3.toString("hex"));
  });

  it("third node forwards to fourth node", () => {
    const result = forward(fixture.packet3);
    expect(result.toString("hex")).to.equal(fixture.rawPacket4.toString("hex"));
  });
});
