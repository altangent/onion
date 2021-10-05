import { Packet } from "../Types";

const b = (str: string) => Buffer.from(str, "hex");

export const nodeSecrets = [
  Buffer.alloc(32, 0x01),
  Buffer.alloc(32, 0x02),
  Buffer.alloc(32, 0x03),
  Buffer.alloc(32, 0x04),
];

export const nodeIds = [
    b("031b84c5567b126440995d3ed5aaba0565d71e1834604819ff9c17f5e9d5dd078f", ),
    b("024d4b6cd1361032ca9bd2aeb9d900aa4d45d9ead80ac9423374c451a7254d0766", ), 
    b("02531fe6068134503d2723133227c867ac8fa6c83c537e9a44c3c5bdbdcb1fe337", ),
    b("03462779ad4aad39514614751a71085f2f10e1c7a593e4e030efb5b8721ce55b0b", ),
  ]; // prettier-ignore

export const rawPacket1 = b(
  "00" +
    "0362c0a046dacce86ddd0343c6d3c7c79c2208ba0d9c9cf24a6d046d21d21f90f7" +
    "3ae754e241ee2df71aecd18065282538d64ac26e630c22c9075a60c53c7595009c8c666e361de17ffd490a70ea2d959c004c606aa88c5dae4d5e743ba7bb8f84e1301a676563da1bbb48b1a8cc1f3384917a4f9ef48a7c6e0fb27ae8c441ba60abeb40acacfe57e1050042ca2444b49643bfd8a978d059ff9a79b2ccfb5f50bd93c3bb24"
);

export const rawPacket2 = b(
  "00" +
    "0362c0a046dacce86ddd0343c6d3c7c79c2208ba0d9c9cf24a6d046d21d21f90f7" +
    "ca1fb2e76f58cbcd549e841a555471fffb42bc83640b71ba55d0ee39414eab6095060c75c37671f8652e8cf0516fa999ddd8ae836d465e4adae66e3ca1d6f76531e703f5816b355f3ed03413bf7079b1a5ba97971fd0c5c0aad8259b21fc7acabd56d4"
);

export const rawPacket3 = b(
  "00" +
    "0362c0a046dacce86ddd0343c6d3c7c79c2208ba0d9c9cf24a6d046d21d21f90f7" +
    "e1d86ef44c16483ad91156b865fbbe6d813e23d33d81f70125d9fbf769fcf27cf4a7b8b9aaee5d8f088a84dc6475f76607cffca32239b28cf881549c0ccc8493853c"
);

export const rawPacket4 = b(
  "00" +
    "0362c0a046dacce86ddd0343c6d3c7c79c2208ba0d9c9cf24a6d046d21d21f90f7" +
    "7ce87dd811f3886c9f56f40e4d3b4f59c445944f79fb79f7a0eff2e24498ce89a4"
);

export const packet1: Packet = {
  version: 0,
  ephemeralPoint: b(
    "0362c0a046dacce86ddd0343c6d3c7c79c2208ba0d9c9cf24a6d046d21d21f90f7"
  ),
  sharedSecret: b(
    "4cc7dbb4b2a22bd9f04c641c83368b0ebaf9f5ab427c03facd79f9f3b3c52f59"
  ),
  decryptedPayload: b(
    "024d4b6cd1361032ca9bd2aeb9d900aa4d45d9ead80ac9423374c451a7254d0766" +
      "ca1fb2e76f58cbcd549e841a555471fffb42bc83640b71ba55d0ee39414eab6095060c75c37671f8652e8cf0516fa999ddd8ae836d465e4adae66e3ca1d6f76531e703f5816b355f3ed03413bf7079b1a5ba97971fd0c5c0aad8259b21fc7acabd56d4"
  ),
  payload: {
    nextPubKey: b(
      "024d4b6cd1361032ca9bd2aeb9d900aa4d45d9ead80ac9423374c451a7254d0766"
    ),
    nextPayload: b(
      "ca1fb2e76f58cbcd549e841a555471fffb42bc83640b71ba55d0ee39414eab6095060c75c37671f8652e8cf0516fa999ddd8ae836d465e4adae66e3ca1d6f76531e703f5816b355f3ed03413bf7079b1a5ba97971fd0c5c0aad8259b21fc7acabd56d4"
    ),
  },
};

export const packet2: Packet = {
  version: 0,
  ephemeralPoint: b(
    "0362c0a046dacce86ddd0343c6d3c7c79c2208ba0d9c9cf24a6d046d21d21f90f7"
  ),
  sharedSecret: b(
    "4c7e9426338c8b355f251a4901a366b781c57ad736107d70c75cb3d005f554b5"
  ),
  decryptedPayload: b(
    "02531fe6068134503d2723133227c867ac8fa6c83c537e9a44c3c5bdbdcb1fe337" +
      "e1d86ef44c16483ad91156b865fbbe6d813e23d33d81f70125d9fbf769fcf27cf4a7b8b9aaee5d8f088a84dc6475f76607cffca32239b28cf881549c0ccc8493853c"
  ),
  payload: {
    nextPubKey: b(
      "02531fe6068134503d2723133227c867ac8fa6c83c537e9a44c3c5bdbdcb1fe337"
    ),
    nextPayload: b(
      "e1d86ef44c16483ad91156b865fbbe6d813e23d33d81f70125d9fbf769fcf27cf4a7b8b9aaee5d8f088a84dc6475f76607cffca32239b28cf881549c0ccc8493853c"
    ),
  },
};

export const packet3: Packet = {
  version: 0,
  ephemeralPoint: b(
    "0362c0a046dacce86ddd0343c6d3c7c79c2208ba0d9c9cf24a6d046d21d21f90f7"
  ),
  sharedSecret: b(
    "655f1f630f5319300cb71f292b5128274f4c0c546e796d47c976fce22388b4e2"
  ),
  decryptedPayload: b(
    "03462779ad4aad39514614751a71085f2f10e1c7a593e4e030efb5b8721ce55b0b" +
      "7ce87dd811f3886c9f56f40e4d3b4f59c445944f79fb79f7a0eff2e24498ce89a4"
  ),
  payload: {
    nextPubKey: b(
      "03462779ad4aad39514614751a71085f2f10e1c7a593e4e030efb5b8721ce55b0b"
    ),
    nextPayload: b(
      "7ce87dd811f3886c9f56f40e4d3b4f59c445944f79fb79f7a0eff2e24498ce89a4"
    ),
  },
};

export const packet4: Packet = {
  version: 0,
  ephemeralPoint: b(
    "0362c0a046dacce86ddd0343c6d3c7c79c2208ba0d9c9cf24a6d046d21d21f90f7"
  ),
  sharedSecret: b(
    "4eb03a5b5195c6b760c2fa4f3d2cd12fd3ea9e6fc85136c4228ef20cbe84bb6e"
  ),
  decryptedPayload: b(
    "68656c6c6f00000000000000000000000000000000000000000000000000000000"
  ),
  payload: {
    nextPubKey: b(
      "68656c6c6f00000000000000000000000000000000000000000000000000000000"
    ),
    nextPayload: b(""),
  },
};
