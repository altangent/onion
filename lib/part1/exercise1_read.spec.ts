import { expect } from "chai";
import * as fixtures from "./fixtures";
import { read } from "./exercise1_read";
import { nodeSecrets } from "../part2/fixtures";

describe("part 1, exercise 1 - read", () => {
  it("first packet", () => {
    const result = read(fixtures.rawPacket1, nodeSecrets[0]);
    expect(result.version).to.equal(0);
    expect(result.payload.nextPubKey.toString("hex")).to.equal(
      fixtures.packet1.payload.nextPubKey.toString("hex")
    );
    expect(result.payload.nextPayload.toString("hex")).to.equal(
      fixtures.packet1.payload.nextPayload.toString("hex")
    );
  });

  it("second packet", () => {
    const result = read(fixtures.rawPacket2, nodeSecrets[1]);
    expect(result.version).to.equal(0);
    expect(result.payload.nextPubKey.toString("hex")).to.equal(
      fixtures.packet2.payload.nextPubKey.toString("hex")
    );
    expect(result.payload.nextPayload.toString("hex")).to.equal(
      fixtures.packet2.payload.nextPayload.toString("hex")
    );
  });

  it("third packet", () => {
    const result = read(fixtures.rawPacket3, nodeSecrets[2]);
    expect(result.version).to.equal(0);
    expect(result.payload.nextPubKey.toString("hex")).to.equal(
      fixtures.packet3.payload.nextPubKey.toString("hex")
    );
    expect(result.payload.nextPayload.toString("hex")).to.equal(
      fixtures.packet3.payload.nextPayload.toString("hex")
    );
  });

  it("final packet", () => {
    const result = read(fixtures.rawPacket4, nodeSecrets[3]);
    expect(result.version).to.equal(0);
    expect(result.payload.nextPubKey.toString("hex")).to.equal(
      fixtures.packet4.payload.nextPubKey.toString("hex")
    );
    expect(result.payload.nextPayload.toString("hex")).to.equal(
      fixtures.packet4.payload.nextPayload.toString("hex")
    );
  });
});
