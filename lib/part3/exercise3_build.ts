import { BufferWriter } from "@node-lightning/bufio";
import * as crypto from "@node-lightning/crypto";

/**
 * You task is to construct a sequence of packets (as raw bytes) and
 * return these packets from the innermost to the outermost.
 *
 * Each packet contains an encrypted payload that is only readable for
 * the receiving node.
 *
 * Each packet is constructed as followed:
 *
 *  [1]:   version
 *  [33]:  ephemeralPoint
 *  [var]: encryptedPayload
 *
 * In order to encrypt the payload, you must first calculate a shared
 * secret using ECDH and the `ephemeralSecret` and node's pubkey.
 *
 * Using this shared secret you can encrypt the payload using a ChaCha20
 * stream with an IV of 0x00000000000000000000000000000000.
 *
 * Each payload contains:
 *
 *  [33]:  nextPubKey
 *  [var]: nextEncryptedPayload
 *
 * Hint 1: You need to build the inner most onion first
 * Hint 2: The inner most onion does not have a `nextEncryptedPayload`
 *
 * @param version onion packet version, should be 0
 * @param ephemeralSecret secret used construct the `ephemeralPoint`
 * @param nodeIds public keys of the nodes in sequential order
 * @param data data sent to each node in sequential order. For the first
 * three hops this includes the `nextNodeId` value. For the final hop it
 * contains a 33-byte message.
 * @returns
 */
export function build(
  version: number,
  ephemeralSecret: Buffer,
  nodeIds: Buffer[],
  data: Buffer[]
): Buffer[] {
  const results: Buffer[] = [];

  // Construct a single ephemeral point that will be used for each hop as
  // a simplification.
  const ephemeralPoint = crypto.getPublicKey(ephemeralSecret, true);

  // Stores the last encrypted payload for use in packet construction.
  // Initially this value is an empty buffer since the last hop doesn't
  // have any data to forward.
  let lastEncryptedPayload: Buffer = Buffer.alloc(0);

  // Iterate our hops in reverse order so we wrap inner onions in outer
  // onions
  while (nodeIds.length) {
    const nodeId = nodeIds.pop();

    // Construct the paylaod
    const payloadWriter = new BufferWriter();

    // Write the nextNodeId
    payloadWriter.writeBytes(data.pop());

    // Write the next node's encrypted data
    payloadWriter.writeBytes(lastEncryptedPayload);

    // Create a shared secret using ECDH
    const sharedSecret = crypto.ecdh(nodeId, ephemeralSecret);

    // Encrypt the raw payload using the shared secret
    const encryptedPayload = crypto.chachaEncrypt(
      sharedSecret,
      Buffer.alloc(16),
      payloadWriter.toBuffer()
    );

    // Construct the packet
    const packetWriter = new BufferWriter();

    // We always use version 0 for the onion packet version
    packetWriter.writeUInt8(version);

    // Ephemeral point that is the same for each hop
    packetWriter.writeBytes(ephemeralPoint);

    // Include the encrypted payload that we just constructed
    packetWriter.writeBytes(encryptedPayload);

    // Add the packet to the results
    results.push(packetWriter.toBuffer());

    // Capture the encrypted payload for use in the next layer
    lastEncryptedPayload = encryptedPayload;
  }

  return results;
}
