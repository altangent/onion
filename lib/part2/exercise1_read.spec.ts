import { expect } from "chai";
import * as fixtures from "./fixtures";
import { read } from "./exercise1_read";

describe("part 2, exercise 1 - read", () => {
  it("first packet", () => {
    const result = read(fixtures.rawPacket1);
    expect(result.version).to.equal(0);
    expect(result.payload.nextPubKey.toString("hex")).to.equal(
      fixtures.packet1.payload.nextPubKey.toString("hex")
    );
    expect(result.payload.nextPayload.toString("hex")).to.equal(
      fixtures.packet1.payload.nextPayload.toString("hex")
    );
  });

  it("second packet", () => {
    const result = read(fixtures.rawPacket2);
    expect(result.version).to.equal(0);
    expect(result.payload.nextPubKey.toString("hex")).to.equal(
      fixtures.packet2.payload.nextPubKey.toString("hex")
    );
    expect(result.payload.nextPayload.toString("hex")).to.equal(
      fixtures.packet2.payload.nextPayload.toString("hex")
    );
  });

  it("third packet", () => {
    const result = read(fixtures.rawPacket3);
    expect(result.version).to.equal(0);
    expect(result.payload.nextPubKey.toString("hex")).to.equal(
      fixtures.packet3.payload.nextPubKey.toString("hex")
    );
    expect(result.payload.nextPayload.toString("hex")).to.equal(
      fixtures.packet3.payload.nextPayload.toString("hex")
    );
  });

  it("final packet", () => {
    const result = read(fixtures.rawPacket4);
    expect(result.version).to.equal(0);
    expect(result.payload.nextPubKey.toString("hex")).to.equal(
      fixtures.packet4.payload.nextPubKey.toString("hex")
    );
    expect(result.payload.nextPayload.toString("hex")).to.equal(
      fixtures.packet4.payload.nextPayload.toString("hex")
    );
  });
});
