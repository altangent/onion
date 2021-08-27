import { BufferWriter } from "@node-lightning/bufio";
import * as crypto from "@node-lightning/crypto";

import * as ex1 from "./ex1";
import * as ex2 from "./ex2";
import * as ex3 from "./ex3";
import * as ex4 from "./ex4";

const method = process.argv[2] || "ex1";

const nodeSecrets = [
  Buffer.alloc(32, 0x01),
  Buffer.alloc(32, 0x02),
  Buffer.alloc(32, 0x03),
  Buffer.alloc(32, 0x04),
];

const nodeIds = nodeSecrets.map((p) => crypto.getPublicKey(p, true));

const data = [
  Buffer.alloc(4, 0x11),
  Buffer.alloc(4, 0x22),
  Buffer.alloc(4, 0x33),
  Buffer.alloc(4, 0x44),
];

const seed = Buffer.alloc(32, 0x05);

let title: string;
let builder: (
  version: number,
  data: Buffer[],
  seed?: Buffer,
  nodeIds?: Buffer[],
  ep_points?: Buffer[]
) => Buffer;
let reader: (
  packet: Buffer,
  nodeKeys?: Buffer[],
  ep_points?: Buffer[]
) => Buffer;

switch (method) {
  case "ex1": {
    title = "Stupid Simple Example";
    builder = ex1.build;
    reader = ex1.read;
    break;
  }
  case "ex2": {
    title = "HMAC Example";
    builder = ex2.build;
    reader = ex2.read;
    break;
  }
  case "ex3": {
    title = "Payload Encryption";
    builder = ex3.build;
    reader = ex3.read;
    break;
  }
  case "ex4": {
    title = "Ephemeral Key Rotation";
    builder = ex4.build;
    reader = ex4.read;
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

do {
  packetBuf = reader(packetBuf, nodeSecrets);
} while (packetBuf && packetBuf.length);
