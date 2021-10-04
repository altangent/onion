# Part 1 - Single Packet

Attempting to send a message to a recipient. The sender is able to route
the message through a sequence of intermediate nodes.

This example routes the message through through three intermediate nodes
and the fourth node is the message receiver. Below is each node's
33-byte public key.

```
Node 1: 031b84c5567b126440995d3ed5aaba0565d71e1834604819ff9c17f5e9d5dd078f
Node 2: 024d4b6cd1361032ca9bd2aeb9d900aa4d45d9ead80ac9423374c451a7254d0766
Node 3: 02531fe6068134503d2723133227c867ac8fa6c83c537e9a44c3c5bdbdcb1fe337
Node 4: 03462779ad4aad39514614751a71085f2f10e1c7a593e4e030efb5b8721ce55b0b
```

The exercises will define three functions:

1. `read` - reads a `Buffer` object and returns the parsed `Packet` object
2. `forward` - reads a `Packet` object and constructs the next packet as a `Buffer`
3. `build` - constructs the packets each hop will receive

--

For this example, we will resuse the same packet at each hop.

The packet is constructed as follows:

```
packet:
  [1]:   version
  [var]: payload
```

The payload is simply a sequence of 33-byte pubkeys

```
payload:
  [33]: pubkey_1
  ...
  [33]: pubkey_n
```

The packet looks like:

```
version: 00
payload: 024d4b6cd1361032ca9bd2aeb9d900aa4d45d9ead80ac9423374c451a7254d0766
         02531fe6068134503d2723133227c867ac8fa6c83c537e9a44c3c5bdbdcb1fe337
         03462779ad4aad39514614751a71085f2f10e1c7a593e4e030efb5b8721ce55b0b
         68656c6c6f00000000000000000000000000000000000000000000000000000000
```

- There is no confidentiality since obfuscation of data is used
- There is no integrity as no MACs are used.
- There is no privacy because you can see the exact path that was taken
