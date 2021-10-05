import { ecdh, chachaDecrypt } from "@node-lightning/crypto";
import { BufferReader } from "@node-lightning/bufio";
import { Packet } from "../Types";

/**
 * Your task is to read a raw packet into its component pieces. The
 * packet is being read by a node whose private key is defined in
 * the `nodeKey` argument.
 *
 * The packet is constructed as follows:
 *
 *  [1]:   version
 *  [33]:  ephemeralPoint
 *  [var]: encryptedPayload
 *
 * You will need constructed a shared secret using ECDH using the
 * `ephemeralPoint` and the node's private key.
 *
 * Using this shared secret you can decrypt the payload using a ChaCha20
 * stream with an IV of 0x00000000000000000000000000000000.
 *
 * The payload is constructed as follows:
 *   [33]:  nextPubKey
 *   [var]: nextPayload
 *
 * `nextPubKey` will be the public key of the node that the next
 * packet will be sent do.
 *
 * `nextPayload` will be the payload that is sent to the next node. It
 * can only be decrypted by the next node.
 */
export function read(packet: Buffer, nodeKey: Buffer): Packet {
  const packetReader = new BufferReader(packet);

  // Read the version, we should always expect 0x00
  const version = packetReader.readUInt8();

  // Read the ephemeral point, in this example we reuse the same point
  // which would allow correlation of the onion.
  const ephemeralPoint = packetReader.readBytes(33);

  // Read the payload from the packet
  const encryptedPayload = packetReader.readBytes();

  // Construct a shared secret using ECDH using the ephemeral point and
  // our public key.
  const sharedSecret = ecdh(ephemeralPoint, nodeKey);

  // Decrypt the payload using shared secret
  const decryptedPayload = chachaDecrypt(
    sharedSecret,
    Buffer.alloc(16),
    encryptedPayload
  );

  // Parse the payload
  const payloadReader = new BufferReader(decryptedPayload);
  const nextPubKey = payloadReader.readBytes(33);
  const nextPayload = payloadReader.readBytes();

  return {
    version,
    ephemeralPoint,
    sharedSecret,
    encryptedPayload,
    decryptedPayload,
    payload: {
      nextPubKey,
      nextPayload,
    },
  };
}
