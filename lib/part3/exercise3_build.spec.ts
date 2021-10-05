import { expect } from "chai";
import { build } from "./exercise3_build";
import * as fixtures from "./fixtures";

describe("part 3, exercise 3 - build", () => {
  it("builds correct layers", () => {
    const ephemeralSecret = Buffer.alloc(32, 0x05);

    const data = [
      Buffer.from(fixtures.nodeIds[1]),
      Buffer.from(fixtures.nodeIds[2]),
      Buffer.from(fixtures.nodeIds[3]),
      Buffer.from("68656c6c6f00000000000000000000000000000000000000000000000000000000", "hex"), // prettier-ignore
    ];

    const results = build(0, ephemeralSecret, fixtures.nodeIds, data);
    expect(results[0].toString("hex")).to.equal(fixtures.rawPacket4.toString("hex")); // prettier-ignore
    expect(results[1].toString("hex")).to.equal(fixtures.rawPacket3.toString("hex")); // prettier-ignore
    expect(results[2].toString("hex")).to.equal(fixtures.rawPacket2.toString("hex")); // prettier-ignore
    expect(results[3].toString("hex")).to.equal(fixtures.rawPacket1.toString("hex")); // prettier-ignore
  });
});
