export type Packet = {
  version: number;
  payload: Payload;
  ephemeralPoint?: Buffer;
  sharedSecret?: Buffer;
  encryptedPayload?: Buffer;
  decryptedPayload?: Buffer;
  hmac?: Buffer;
};

export type Payload = {
  nextPubKey: Buffer;
  nextHmac?: Buffer;
  nextPayload: Buffer;
};
