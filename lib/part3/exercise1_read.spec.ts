import { expect } from "chai";
import * as fixtures from "./fixtures";
import { read } from "./exercise1_read";

describe("part 3, exercise 1 - read", () => {
  it("first packet", () => {
    const result = read(fixtures.rawPacket1, fixtures.nodeSecrets[0]);
    expect(result.version).to.equal(fixtures.packet1.version);
    expect(result.ephemeralPoint.toString("hex")).to.equal(
      fixtures.packet1.ephemeralPoint.toString("hex")
    );
    expect(result.sharedSecret.toString("hex")).to.equal(
      fixtures.packet1.sharedSecret.toString("hex")
    );
    expect(result.decryptedPayload.toString("hex")).to.equal(
      fixtures.packet1.decryptedPayload.toString("hex")
    );
    expect(result.payload.nextPubKey.toString("hex")).to.equal(
      fixtures.packet1.payload.nextPubKey.toString("hex")
    );
    expect(result.payload.nextPayload.toString("hex")).to.equal(
      fixtures.packet1.payload.nextPayload.toString("hex")
    );
  });

  it("second packet", () => {
    const result = read(fixtures.rawPacket2, fixtures.nodeSecrets[1]);
    expect(result.version).to.equal(fixtures.packet1.version);
    expect(result.ephemeralPoint.toString("hex")).to.equal(
      fixtures.packet2.ephemeralPoint.toString("hex")
    );
    expect(result.sharedSecret.toString("hex")).to.equal(
      fixtures.packet2.sharedSecret.toString("hex")
    );
    expect(result.decryptedPayload.toString("hex")).to.equal(
      fixtures.packet2.decryptedPayload.toString("hex")
    );
    expect(result.payload.nextPubKey.toString("hex")).to.equal(
      fixtures.packet2.payload.nextPubKey.toString("hex")
    );
    expect(result.payload.nextPayload.toString("hex")).to.equal(
      fixtures.packet2.payload.nextPayload.toString("hex")
    );
  });

  it("third packet", () => {
    const result = read(fixtures.rawPacket3, fixtures.nodeSecrets[2]);
    expect(result.version).to.equal(fixtures.packet3.version);
    expect(result.ephemeralPoint.toString("hex")).to.equal(
      fixtures.packet3.ephemeralPoint.toString("hex")
    );
    expect(result.sharedSecret.toString("hex")).to.equal(
      fixtures.packet3.sharedSecret.toString("hex")
    );
    expect(result.decryptedPayload.toString("hex")).to.equal(
      fixtures.packet3.decryptedPayload.toString("hex")
    );
    expect(result.payload.nextPubKey.toString("hex")).to.equal(
      fixtures.packet3.payload.nextPubKey.toString("hex")
    );
    expect(result.payload.nextPayload.toString("hex")).to.equal(
      fixtures.packet3.payload.nextPayload.toString("hex")
    );
  });

  it("final packet", () => {
    const result = read(fixtures.rawPacket4, fixtures.nodeSecrets[3]);
    expect(result.version).to.equal(fixtures.packet4.version);
    expect(result.ephemeralPoint.toString("hex")).to.equal(
      fixtures.packet4.ephemeralPoint.toString("hex")
    );
    expect(result.sharedSecret.toString("hex")).to.equal(
      fixtures.packet4.sharedSecret.toString("hex")
    );
    expect(result.decryptedPayload.toString("hex")).to.equal(
      fixtures.packet4.decryptedPayload.toString("hex")
    );
    expect(result.payload.nextPubKey.toString("hex")).to.equal(
      fixtures.packet4.payload.nextPubKey.toString("hex")
    );
    expect(result.payload.nextPayload.toString("hex")).to.equal(
      fixtures.packet4.payload.nextPayload.toString("hex")
    );
  });
});
