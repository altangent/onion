import { Packet } from "../Types";

export const nodeSecrets = [
  Buffer.alloc(32, 0x01),
  Buffer.alloc(32, 0x02),
  Buffer.alloc(32, 0x03),
  Buffer.alloc(32, 0x04),
];

export const nodeIds = [
    Buffer.from("031b84c5567b126440995d3ed5aaba0565d71e1834604819ff9c17f5e9d5dd078f", "hex"),
    Buffer.from("024d4b6cd1361032ca9bd2aeb9d900aa4d45d9ead80ac9423374c451a7254d0766", "hex"), 
    Buffer.from("02531fe6068134503d2723133227c867ac8fa6c83c537e9a44c3c5bdbdcb1fe337", "hex"),
    Buffer.from("03462779ad4aad39514614751a71085f2f10e1c7a593e4e030efb5b8721ce55b0b", "hex"),
  ]; // prettier-ignore

export const rawPacket1 = Buffer.from(
  "00" +
    "024d4b6cd1361032ca9bd2aeb9d900aa4d45d9ead80ac9423374c451a7254d0766" +
    "02531fe6068134503d2723133227c867ac8fa6c83c537e9a44c3c5bdbdcb1fe337" +
    "03462779ad4aad39514614751a71085f2f10e1c7a593e4e030efb5b8721ce55b0b" +
    "68656c6c6f00000000000000000000000000000000000000000000000000000000",
  "hex"
);

export const rawPacket2 = Buffer.from(
  "00" +
    "02531fe6068134503d2723133227c867ac8fa6c83c537e9a44c3c5bdbdcb1fe337" +
    "03462779ad4aad39514614751a71085f2f10e1c7a593e4e030efb5b8721ce55b0b" +
    "68656c6c6f00000000000000000000000000000000000000000000000000000000",
  "hex"
);

export const rawPacket3 = Buffer.from(
  "00" +
    "03462779ad4aad39514614751a71085f2f10e1c7a593e4e030efb5b8721ce55b0b" +
    "68656c6c6f00000000000000000000000000000000000000000000000000000000",
  "hex"
);

export const rawPacket4 = Buffer.from(
  "00" + "68656c6c6f00000000000000000000000000000000000000000000000000000000",
  "hex"
);

export const packet1: Packet = {
  version: 0,
  payload: {
    nextPubKey: Buffer.from(
      "024d4b6cd1361032ca9bd2aeb9d900aa4d45d9ead80ac9423374c451a7254d0766",
      "hex"
    ),
    nextPayload: Buffer.from(
      "02531fe6068134503d2723133227c867ac8fa6c83c537e9a44c3c5bdbdcb1fe337" +
        "03462779ad4aad39514614751a71085f2f10e1c7a593e4e030efb5b8721ce55b0b" +
        "68656c6c6f00000000000000000000000000000000000000000000000000000000",
      "hex"
    ),
  },
};

export const packet2: Packet = {
  version: 0,
  payload: {
    nextPubKey: Buffer.from(
      "02531fe6068134503d2723133227c867ac8fa6c83c537e9a44c3c5bdbdcb1fe337",
      "hex"
    ),
    nextPayload: Buffer.from(
      "03462779ad4aad39514614751a71085f2f10e1c7a593e4e030efb5b8721ce55b0b" +
        "68656c6c6f00000000000000000000000000000000000000000000000000000000",
      "hex"
    ),
  },
};

export const packet3: Packet = {
  version: 0,
  payload: {
    nextPubKey: Buffer.from(
      "03462779ad4aad39514614751a71085f2f10e1c7a593e4e030efb5b8721ce55b0b",
      "hex"
    ),
    nextPayload: Buffer.from(
      "68656c6c6f00000000000000000000000000000000000000000000000000000000",
      "hex"
    ),
  },
};

export const packet4: Packet = {
  version: 0,
  payload: {
    nextPubKey: Buffer.from(
      "68656c6c6f00000000000000000000000000000000000000000000000000000000",
      "hex"
    ),
    nextPayload: Buffer.from("", "hex"),
  },
};
