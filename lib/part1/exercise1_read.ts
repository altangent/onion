import { BufferReader } from "@node-lightning/bufio";
import * as crypto from "@node-lightning/crypto";
import { Packet } from "../Types";

/**
 * Your task is to read the packet and return a payload containing the
 * next nodeId. The nextPayload will be the same as the received payload.
 */
export function read(packet: Buffer, myKey: Buffer): Packet {
  const myPubKey = crypto.getPublicKey(myKey);
  const packetReader = new BufferReader(packet);

  // read version
  const version = packetReader.readUInt8(); // expect version 1

  // read payload
  const payload = packetReader.readBytes();

  // read the payload
  const payloadReader = new BufferReader(payload);

  // read all the pubkeys
  const pubkeys: Buffer[] = [];
  while (!payloadReader.eof) {
    pubkeys.push(payloadReader.readBytes(33));
  }

  // find our pubkey in the list of nodes and we'll forward to the NEXT
  // pubkey in our list. If we can't find our node, then we are the
  // first packet and should forward to the first node.
  let nextPubKey = pubkeys[0];
  for (let i = 0; i < pubkeys.length; i++) {
    if (pubkeys[i].equals(myPubKey)) {
      nextPubKey = pubkeys[i + 1];
      break;
    }
  }

  return {
    version,
    payload: {
      nextPubKey,
      nextPayload: payload,
    },
  };
}
