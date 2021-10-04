import { BufferReader } from "@node-lightning/bufio";
import { Packet } from "../Types";

/**
 * Reads info from the packet. No verification of information is
 * performed.
 *
 * Any node could tamper with information along the way. And since there
 * is no decryption, anyone can see the information (no confidentiality).
 *
 * This example uses a fixed payload length of 33-bytes which is the
 * public key of the next node.
 *
 * @param packet
 */
export function read(packet: Buffer): Packet {
  const packetReader = new BufferReader(packet);

  // read version
  const version = packetReader.readUInt8(); // expect version 1

  // read payload
  const payload = packetReader.readBytes();

  // read the payload
  const payloadReader = new BufferReader(payload);

  // read data
  const nextPubKey = payloadReader.readBytes(33);

  // read next payload
  const nextPayload = payloadReader.readBytes();

  return {
    version,
    payload: {
      nextPubKey,
      nextPayload,
    },
  };
}
