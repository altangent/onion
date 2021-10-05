# Part 3 - Encrypted Payload

This exercise improve on the prior one by adding confidentiality to
the payload. We do this by encrypting the payload at each hop so that a
node is only able to read the information it needs to forward the message.

We add a new piece of information, the ephemeral public key, to the packet
so that a node can decrypt the payload.

The packet is constructed as follows:

```
packet:
  [1]:   version
  [33]:  ephemeralPubKey
  [var]: encryptedPayload
```

When the packet is constructed, the sender generates a private
key called the ephemeral secret. The sender includes the corresponding
ephemeral public key in the packet.

When parsing the packet, the receiving node uses the received ephemeral
public key to create an ECDH shared secret.

```
sharedSecret = ecdh(ephemeralPubKey, nodePrivateKey)
```

The shared secret is then used to decrypt the payloaded using a ChaCha20
stream with an IV of 0x00000000000000000000000000000000.

Once decrypted, the payload contains a 33-byte pubkey for the next node
and a variable length encrypted payload that will be forwarded to the
next node.

```
payload:
  [33]:  nextPubKey
  [var]: nextEncryptedPayload
```

## Analysis

- Confidentiality: Yes
  - Packets are now encrypted. A node cannot read the final message, nor
    concretely know which nodes are participating in the onion.
- Integrity: No
  - Encrypted payloads can be tampered with and the intended recipient
    may be unaware.
- Privacy: No
  - Past privacy is improved dropping the prior packet state at each hop
  - Reuse of the ephemeral key in each packet allows correlation across
    nodes
  - A variable length payload allows a node to easily calculate how many
    hops remain (or know that the next hop is the final recipient)
