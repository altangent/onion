import { BufferWriter } from "@node-lightning/bufio";
import { Packet } from "../Types";

/**
 * Constructs a raw packet to forward to the next node in the hop. This
 * example simply constructs a new packet using the next payload.
 * @param received
 * @returns
 */
export function forward(received: Packet): Buffer {
  // Return the next packet
  const nextPacket = new BufferWriter();
  nextPacket.writeUInt8(received.version);
  nextPacket.writeBytes(received.payload.nextPayload);
  return nextPacket.toBuffer();
}
