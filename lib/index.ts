import { BufferWriter } from "@node-lightning/bufio";
import * as crypto from "@node-lightning/crypto";

import * as ex1 from "./ex1";
import * as ex2 from "./ex2";
import * as ex3 from "./ex3";
import * as ex4 from "./ex4";
import { Packet } from "./Types";

const method = process.argv[2] || "ex1";

const nodeSecrets = [
  Buffer.alloc(32, 0x01),
  Buffer.alloc(32, 0x02),
  Buffer.alloc(32, 0x03),
  Buffer.alloc(32, 0x04),
];

const nodeIds = nodeSecrets.map((p) => crypto.getPublicKey(p, true));

const data = [
  Buffer.from(nodeIds[1]),
  Buffer.from(nodeIds[2]),
  Buffer.from(nodeIds[3]),
  Buffer.from("68656c6c6f00000000000000000000000000000000000000000000000000000000", "hex"), // prettier-ignore
];

const seed = Buffer.alloc(32, 0x05);

let title: string;
let builder: (
  version: number,
  data: Buffer[],
  seed?: Buffer,
  nodeIds?: Buffer[]
) => Buffer;

let reader: (packet: Buffer, nodeKey?: Buffer) => Packet;

let forward: (payload: Packet, nodeKey?: Buffer) => Buffer;

switch (method) {
  case "ex1": {
    title = "Stupid Simple Example";
    builder = ex1.build;
    reader = ex1.read;
    forward = ex1.forward;
    break;
  }
  case "ex2": {
    title = "HMAC Example";
    builder = ex2.build;
    reader = ex2.read;
    forward = ex2.forward;
    break;
  }
  case "ex3": {
    title = "Payload Encryption";
    builder = ex3.build;
    reader = ex3.read;
    forward = ex3.forward;
    break;
  }
  case "ex4": {
    title = "Ephemeral Key Rotation";
    builder = ex4.build;
    reader = ex4.read;
    forward = ex4.forward;
    break;
  }
}

console.log(title);
console.log(
  "==================================================================\n"
);

console.log("Building");
console.log("");

const version = 0;
let packetBuf = builder(version, data, seed, nodeIds);
console.log("Final onion:");
console.log(packetBuf.toString("hex"));

console.log(
  "------------------------------------------------------------------\n"
);
console.log("Reading");
console.log("");

let packet: Packet;
while (true) {
  // Read the packet at each hop
  let nodeKey = nodeSecrets.shift();
  packet = reader(packetBuf, nodeKey);

  // Forward the packet if there is additional payload
  if (packet.payload.nextPayload.length) {
    packetBuf = forward(packet, nodeKey);
  }
  // Otherwise print the final message from the data obtained in the final payload
  else {
    console.log(">> message: ", packet.payload.nextPubKey.toString("hex")); // prettier-ignore
    console.log("            ", packet.payload.nextPubKey.toString()); // prettier-ignore
    break;
  }
}
