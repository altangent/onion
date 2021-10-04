import { BufferWriter } from "@node-lightning/bufio";
import { Packet } from "../Types";

/**
 * You task is to use the parse packet information to construct a
 * raw packet that will be sent to the next node.
 */
export function forward(received: Packet): Buffer {
  const nextPacket = new BufferWriter();
  nextPacket.writeUInt8(received.version);
  nextPacket.writeBytes(received.payload.nextPayload);
  return nextPacket.toBuffer();
}
