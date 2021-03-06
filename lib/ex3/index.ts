import crypto1 from "crypto";
import * as crypto2 from "@node-lightning/crypto";
import { BufferReader, BufferWriter } from "@node-lightning/bufio";
import { Packet } from "../Types";

/**
 * This reads a simplified onion packet. Simplifications are:
 * - Reuse of the same ephemeral key at each hop
 * - Payload encrypted
 * - Use of variable length onion (grows in length with each hop)
 *
 * The packet parsing algorithm extracts from the packet:
 * - [1]   - version
 * - [33]  - ephemeral point (compressed secp256k1)
 * - [var] - variable length payload (Encrypted)
 * - [32]  - HMAC for the packet
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
  console.log("packet           ", packet.toString("hex"));

  const packetReader = new BufferReader(packet);

  // Read the version, we should always expect 0x00
  const version = packetReader.readUInt8();
  console.log("packet version   ", version);

  // Read the ephemeral point, in this example we reuse the same point
  // which would allow correlation of the onion.
  const ephemeralPoint = packetReader.readBytes(33);
  console.log("packet ep        ", ephemeralPoint.toString("hex"));

  // Read the payload from the packet
  const payload = packetReader.readBytes(packet.length - 33 - 32 - 1);

  // Read the HMAC which is the final 32 bytes
  const hmac = packetReader.readBytes();
  console.log("packet hmac      ", hmac.toString("hex"));

  // Construct a shared secret using ECDH using the ephemeral point and
  // our public key.
  const sharedSecret = crypto2.ecdh(ephemeralPoint, nodeKey);

  // Compute an HMAC using the shared secret and the packet (less the
  // HMAC). We can't compute the HMAC using the full packet, because
  // the HMAC can't include itself haha.
  const calcedHmac = crypto2.hmac(
    sharedSecret,
    packet.slice(0, packet.length - 32)
  );
  console.log("processed hmac   ", calcedHmac.toString("hex"));

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

  console.log("packet payload   ", payload.toString("hex"));
  console.log("decrypt payload  ", decrypt_payload.toString("hex"));
  console.log("payload pubkey   ", nextPubKey.toString("hex"));
  console.log("payload next hmac", nextHmac.toString("hex"));
  console.log("payload next data", nextPayload.toString("hex"));

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
 * Creates a new packet from a recieved packet. In this example, the
 * same ephemeral point is used for each example. The constructed packet
 * contains the payload and HMAC that will be read and verified by the
 * next node.
 * @param received
 * @returns
 */
export function forward(received: Packet): Buffer {
  const packetWriter = new BufferWriter();
  packetWriter.writeUInt8(received.version);
  packetWriter.writeBytes(received.ephemeralPoint);
  packetWriter.writeBytes(received.payload.nextPayload);
  packetWriter.writeBytes(received.payload.nextHmac);
  return packetWriter.toBuffer();
}

/**
 * Similar to previous example this onion construction also adds an HMAC to
 * each layer in reverse order. The HMAC for the inner layer must be
 * supplied to the outer layer. The outer layer uses the inner layers HMAC
 * as part of the packet construction. In addition to that we have
 * encrypted the payload using `chacha20` with corresponding shared secret
 * created for that hop. This encryption is done to ensure the confidentiality
 * of the payload during transmission. Therefore, instead of payload data
 * `encrypted_payload` is used for packet generation.
 *
 * Simplifications are:
 * - Reuse of the same ephemeral key at each hop
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
  // Construct a single ephemeral point that will be used for each hop as
  // a simplification.
  const ephemeralPoint = crypto2.getPublicKey(ephemeralSecret, true);

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
    console.log("nodeId            ", nodeId.toString("hex"));

    // creates a shared secret based on the node's publicId and the secret
    // using ECDH
    const sharedSecret = crypto2.ecdh(nodeId, ephemeralSecret);
    console.log("ss                ", sharedSecret.toString("hex"));

    // In this example, the hopPayload includes the current hop's
    // information followed by the HMAC for the next packet, followed
    // by the remainder of the payload.
    const hopPayloadWriter = new BufferWriter();
    const hopData = info.pop();

    // Write the hop's data
    hopPayloadWriter.writeBytes(hopData);
    console.log("data              ", hopData.toString("hex"));

    // Write the HMAC used in the packet for the next hop. Confusingly,
    // this is the LAST HMAC we built, since we're going in reverse order.
    hopPayloadWriter.writeBytes(lastHmac);
    console.log("hmac              ", lastHmac.toString("hex"));

    // Write the payload for the next hop
    hopPayloadWriter.writeBytes(lastPayload);
    console.log("wrapped data      ", lastPayload.toString("hex"));

    const hopPayload = hopPayloadWriter.toBuffer();
    console.log("raw payload       ", hopPayload.toString("hex"));

    // // Lets encrypt the payload
    const enc = crypto2.chachaEncrypt(
      sharedSecret,
      Buffer.alloc(16),
      hopPayload
    );
    console.log("encrypted_payload ", enc.toString("hex"));

    // This next part constructs the packet that will contain the data
    // we just created. This packet will be HMAC'd and used in the next
    // iteration.
    const packetWriter = new BufferWriter();

    // We always use version 0 for the onion packet version
    packetWriter.writeUInt8(version);

    // Ephemeral point that is the same for each hop. Future example
    // will rotate this value.
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

  // Finally we return the complete packet which includes the last
  // packet and the HMAC for it
  return Buffer.concat([lastPacket, lastHmac]);
}
