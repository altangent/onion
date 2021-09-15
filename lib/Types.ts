export type Packet = {
  version: number;
  payload: Payload;
  ephemeralPoint?: Buffer;
  hmac?: Buffer;
};

export type Payload = {
  nextPubKey: Buffer;
  nextHmac?: Buffer;
  nextPayload: Buffer;
};
