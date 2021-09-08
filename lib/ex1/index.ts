import { BufferReader, BufferWriter } from "@node-lightning/bufio";
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
  // Read the packet which usually is constructed as:
  // version|payload

  const packetReader = new BufferReader(packet);
  console.log("packet:        ", packet.toString("hex"));

  // read version
  const version = packetReader.readUInt8(); // expect version 1
  console.log("version:       ", version);

  // NO ephemeral key

  // read payload
  const payload = packetReader.readBytes();
  console.log("payload:       ", payload.toString("hex"));

  // Next we read the payload which is constructed as:
  // data|next_data
  const payloadReader = new BufferReader(payload);

  // read data
  const nextPubKey = payloadReader.readBytes(33);
  console.log("payload pubkey:", nextPubKey.toString("hex"));

  // read next payload
  const nextPayload = payloadReader.eof
    ? Buffer.alloc(0)
    : payloadReader.readBytes();
  console.log("payload next:  ", nextPayload.toString("hex"));
  console.log("");

  return {
    version,
    payload: {
      nextPubKey,
      nextPayload,
    },
  };
}

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

/**
 * This example is really stupid but it acts as the foundation for
 * building cryptographic onions that actually protect information. This
 * construction simply takes the data and builds a linear ordering of
 * the data. There is no MAC, no shared secrets, nothing.
 *
 * As a result, any observer can see the data. Any observer can see
 * how many hops there are. Any hop can tamper with the data. So we
 * completely lack anonymity, confidentiality, and integrity.
 *
 * @param data - data to wrap in onion for each hop
 */
export function build(version: number, data: Buffer[]): Buffer {
  let lastHopData: Buffer = Buffer.alloc(0);

  // Iterate in reverse order to construct our onion from the center
  // to the outside. This is not required for this implementation since
  // there is no cryptographic wrapping, however we can use a similar
  // construct in future implementations that improve on how things work.
  while (data.length) {
    // Extract the currrent hop information
    const currentHopData = data.pop();

    // Prepend the current hop information to the existing information
    const w = new BufferWriter();

    // write data
    w.writeBytes(currentHopData);
    console.log("hop data: ", currentHopData.toString("hex"));

    // write prior data
    w.writeBytes(lastHopData);
    console.log("last data:", lastHopData.toString("hex"));

    lastHopData = w.toBuffer();
    console.log("onion:    ", lastHopData.toString("hex"));
    console.log("");
  }

  // Return the outer layer of the onion
  const packet = new BufferWriter();
  packet.writeUInt8(version);
  packet.writeBytes(lastHopData);
  return packet.toBuffer();
}
