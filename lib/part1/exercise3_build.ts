import { BufferWriter } from "@node-lightning/bufio";

/**
 * You task is to construct the packets that will be received by each
 * of the four nodes.
 */
export function build(version: number, data: Buffer[]): Buffer[] {
  const results: Buffer[] = [];

  const payload = Buffer.concat(data);

  const packet = new BufferWriter();
  packet.writeUInt8(version);
  packet.writeBytes(payload);
  const packetBuf = packet.toBuffer();

  return [packetBuf, packetBuf, packetBuf, packetBuf];
}
