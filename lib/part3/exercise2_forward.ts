import { BufferWriter } from "@node-lightning/bufio";
import { Packet } from "../Types";

/**
 * Your task is to use a recently parsed packet to construct the next
 * packet in the onion containing the next node's encrypted payload.
 *
 * The packet uses the format:
 *
 *  [1]:   version
 *  [33]:  ephemeralPoint
 *  [var]: payload
 */
export function forward(received: Packet): Buffer {
  const packetWriter = new BufferWriter();
  packetWriter.writeUInt8(received.version);
  packetWriter.writeBytes(received.ephemeralPoint);
  packetWriter.writeBytes(received.payload.nextPayload);
  return packetWriter.toBuffer();
}
