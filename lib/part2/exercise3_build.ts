import { BufferWriter } from "@node-lightning/bufio";

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
export function build(version: number, data: Buffer[]): Buffer[] {
  const results: Buffer[] = [];
  let lastPayload: Buffer = Buffer.alloc(0);

  // Iterate in reverse order to construct our onion from the center
  // to the outside. This is not required for this implementation since
  // there is no cryptographic wrapping, however we can use a similar
  // construct in future implementations that improve on how things work.
  while (data.length) {
    // Extract the currrent hop information
    const currentHopData = data.pop();

    // Prepend the current hop information to the existing information
    const payloadWriter = new BufferWriter();

    // write data
    payloadWriter.writeBytes(currentHopData);

    // write prior data
    payloadWriter.writeBytes(lastPayload);

    // write the packet
    const packet = new BufferWriter();
    packet.writeUInt8(version);
    packet.writeBytes(payloadWriter.toBuffer());
    results.push(packet.toBuffer());

    lastPayload = payloadWriter.toBuffer();
  }

  return results;
}
