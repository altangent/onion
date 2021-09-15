import crypto1 from "crypto";
import * as crypto2 from "@node-lightning/crypto";
import { BufferReader, BufferWriter } from "@node-lightning/bufio";
import { Packet } from "../Types";

/**
 * This reads a simplified onion packet. Simplifications are:
 * - Rotation of ephemeral key at each hop
 * - Payload encrypted
 * - Use of variable length onion (grows in length with each hop)
 *
 * The packet parsing algorithm extracts from the packet:
 * - [1]   - version
 * - [33]  - ephemeral point (compressed secp256k1)
 * - [var] - variable length payload (Encrypted)
 * - [32]  - HMAC
 *
 * Each packet has a variable length payload that is decrypted and
 * parsed. After decryption the node uses the first 65-bytes to
 * construct a forwarding packet for the remaining bytes. The remaining
 * bytes are encrypted using a key accessible to the forwarding node and
 * are unreadable by the current node.
 * - [33]  - public key for the next node
 * - [32]  - HMAC covering the next packet constuction
 * - [var] - encrypted data sent to next hop
 * @param packet
 * @param nodeKey
 */
export function read(packet: Buffer, nodeKey: Buffer): Packet {
  console.log("packet             ", packet.toString("hex"));

  const packetReader = new BufferReader(packet);

  // Read the version, we should always expect 0x00
  const version = packetReader.readUInt8();
  console.log("packet version     ", version);

  // Read the ephemeral point, in this example we rotate the ephemeral point
  const ephemeralPoint = packetReader.readBytes(33);
  console.log("ep_from_packet     ", ephemeralPoint.toString("hex"));

  // Read the payload from the packet
  const payload = packetReader.readBytes(packet.length - 32 - 33 - 1);
  console.log("packet payload     ", payload.toString("hex"));

  // Read the HMAC which is the final 32 bytes
  const hmac = packetReader.readBytes();
  console.log("packet hmac        ", hmac.toString("hex"));

  // Construct a shared secret using ECDH using the ephemeral point and
  // our public key.
  const sharedSecret = crypto2.ecdh(ephemeralPoint, nodeKey);
  console.log("ss                 ", sharedSecret.toString("hex"));

  // Compute an HMAC using the shared secret and the packet (less the
  // HMAC). We can't compute the HMAC using the full packet, because
  // the HMAC can't include itself haha.
  const calcedHmac = crypto2.hmac(
    sharedSecret,
    packet.slice(0, packet.length - 32)
  );
  console.log("processed hmac     ", calcedHmac.toString("hex"));

  // Fail the packet if the HMAC is not the expected value!
  if (!crypto1.timingSafeEqual(hmac, calcedHmac)) {
    throw new Error("HMAC failed");
  }

  // Decrypt the payload using shared secret
  const decrypt_payload = crypto2.chachaDecrypt(
    sharedSecret,
    Buffer.alloc(16),
    payload
  );
  // Parse the payload
  const payloadReader = new BufferReader(decrypt_payload);
  const nextPubKey = payloadReader.readBytes(33);
  const nextHmac = payloadReader.readBytes(32);
  const nextPayload = payloadReader.eof
    ? Buffer.alloc(0)
    : payloadReader.readBytes();

  console.log("payload next pubkey", nextPubKey.toString("hex"));
  console.log("payload next hmac  ", nextHmac.toString("hex"));
  console.log("payload next data  ", nextPayload.toString("hex"));

  console.log("");

  return {
    version,
    ephemeralPoint,
    payload: {
      nextPubKey,
      nextPayload,
      nextHmac,
    },
  };
}

/**
 * Cosntructs a forwarding packet from the received packet. This example
 * creates a blinded ephemeral point for the next hop instead of passing
 * along the same ephemeral point.
 * @param received
 * @param nodeKey
 * @returns
 */
export function forward(received: Packet, nodeKey: Buffer): Buffer {
  // Recompute the shared secret that was used when reading the packet.
  const sharedSecret = crypto2.ecdh(received.ephemeralPoint, nodeKey);

  // blindFactor used in ep rotation
  const blindFactor = crypto2.sha256(
    Buffer.concat([received.ephemeralPoint, sharedSecret])
  );

  // Next ep_pt derived using current ephemeralPoint and blindFactor
  const nextEphemeralPoint = crypto2.publicKeyTweakMul(
    received.ephemeralPoint,
    blindFactor,
    true
  );

  const packetWriter = new BufferWriter();
  packetWriter.writeUInt8(0);
  packetWriter.writeBytes(nextEphemeralPoint);
  packetWriter.writeBytes(received.payload.nextPayload);
  packetWriter.writeBytes(received.payload.nextHmac);
  return packetWriter.toBuffer();
}

/**
 * This onion construction is bit trickier, here we are rotating
 * the ephemeral key @ each hop this is done so the routing nodes
 * won't be able to correlate the onion. The HMAC for the inner
 * layer must be supplied to the outer layer. The outer layer
 * uses the inner layers HMAC as part of the packet construction.
 *
 * Simplifications are:
 * - Rotation of the ephemeral key at each hop
 * - Payload encrypted
 * - Use of variable length onion (no sphinx)
 *
 * @param info - data to wrap in onion for each hop
 * @param ephemeralSecret - 32-byte secret
 * @param nodeIds - list of 33-byte public keys for each node to route
 * through
 */
export function build(
  version: number,
  info: Buffer[],
  ephemeralSecret: Buffer,
  nodeIds: Buffer[]
): Buffer {
  // Ephemeral key :
  let ep_key = ephemeralSecret;

  // Lets precompute the ep_keys in forward pass :
  let ep_key_buff: Buffer[] = [];
  for (let keys of nodeIds) {
    ep_key_buff.push(ep_key);
    let nodeId = keys;
    const sharedSecret = crypto2.ecdh(nodeId, ep_key);
    let ephemeralPoint = crypto2.getPublicKey(ep_key, true);
    let blindFactor = crypto2.sha256(
      Buffer.concat([ephemeralPoint, sharedSecret])
    );
    ep_key = crypto2.privateKeyMul(ep_key, blindFactor);
  }

  // Stores the last processed (inner) HMAC for use in packet
  // construction. Initially this is 0x00*32
  let lastHmac: Buffer = Buffer.alloc(32);

  // Stores the last payload for use in packet construction. Initially
  // this value is an empty buffer.
  let lastPayload: Buffer = Buffer.alloc(0);

  // Stores the last constructed packet, which is created to create the
  // HMAC. Conveniently, we return the last computed packet!
  let lastPacket: Buffer;

  // Iterate our hops in reverse order so we wrap inner onions in outer
  // onions. The outer onion HMAC will include the inner onion HMAC.
  while (info.length) {
    const nodeId = nodeIds.pop();
    console.log("nodeId           ", nodeId.toString("hex"));

    ep_key = ep_key_buff.pop();
    // creates a shared secret based on the node's publicId and the secret
    // using ECDH
    const sharedSecret = crypto2.ecdh(nodeId, ep_key);
    console.log("ss               ", sharedSecret.toString("hex"));

    // Ephemeral Point based on ep_key (ep rotation)
    let ephemeralPoint = crypto2.getPublicKey(ep_key, true);
    console.log("ep               ", ephemeralPoint.toString("hex"));

    // In this example, the hopPayload includes the current hop's
    // information followed by the HMAC for the next packet, followed
    // by the remainder of the payload.
    const hopPayloadWriter = new BufferWriter();
    const hopData = info.pop();

    // Write the hop's data
    hopPayloadWriter.writeBytes(hopData);
    console.log("data             ", hopData.toString("hex"));

    // Write the HMAC used in the packet for the next hop. Confusingly,
    // this is the LAST HMAC we built, since we're going in reverse order.
    hopPayloadWriter.writeBytes(lastHmac);
    console.log("hmac             ", lastHmac.toString("hex"));

    // Write the payload for the next hop
    hopPayloadWriter.writeBytes(lastPayload);
    console.log("wrapped data     ", lastPayload.toString("hex"));

    const hopPayload = hopPayloadWriter.toBuffer();
    console.log("raw payload      ", hopPayload.toString("hex"));

    // Lets encrypt the payload
    const enc = crypto2.chachaEncrypt(
      sharedSecret,
      Buffer.alloc(16),
      hopPayload
    );
    console.log("encrypted_payload", enc.toString("hex"));

    // This next part constructs the packet that will contain the data
    // we just created. This packet will be HMAC'd and used in the next
    // iteration.
    const packetWriter = new BufferWriter();

    // We always use version 0 for the onion packet version
    packetWriter.writeUInt8(version);

    // Ephemeral point that is rotated in each hop
    packetWriter.writeBytes(ephemeralPoint);

    // Include the encrypted payload that we just constructed.
    packetWriter.writeBytes(enc);

    // Finally we will construct the next HMAC for this packet using the
    // shared secret. This HMAC will be used by the next (outer) layer.
    lastHmac = crypto2.hmac(sharedSecret, packetWriter.toBuffer(), "sha256");

    lastPayload = enc;
    lastPacket = packetWriter.toBuffer();
    console.log("");
  }

  // Finally we return the complete packet which includes ep rotations, last
  // packet and the HMAC for it
  return Buffer.concat([lastPacket, lastHmac]);
}
