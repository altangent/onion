# Introducing HMAC

This is an example construction that provides zero confidentiality,
privacy but maintains integrity of the onion.

The onion construction simply "wraps" the prior data with hmac by prepending the
new data to it.

Integrity is maintained because of HMAC used.
There is no confidentiality as no obfuscation of data is used.
There is no privacy because you can see how many hops exist in the path.

## Building

If you have data parts that are each 4-bytes: `11111111` and `22222222`
for hops 1 and 2 respectively...

Inner onion: `04222222220000000000000000000000000000000000000000000000000000000000000000`<br>
Outer onion: `0411111111f42099f19c17830f1107b210c6c6c91a7813ac43d099d2c0fe4f2f504fd83cbe` + `04222222220000000000000000000000000000000000000000000000000000000000000000`<br>

Last 32 bytes are considered as an HMAC which can be compared to check if the computed HMAC of the data matches the given HMAC of onion thus maintaining integrity.
Although currently this is not encrypted thus anyone changing the data could also tamper the corresponding HMAC, but don't worry we will deal with that in later examples,
stay tuned!

## Reading

To read is quite simple. Each hop strips and reads the length byte,
associated data and the corresponding HMAC from the front of the packet. It then forwards the
remainder of the data.

Hop1 input: `0411111111f42099f19c17830f1107b210c6c6c91a7813ac43d099d2c0fe4f2f504fd83cbe04222222220000000000000000000000000000000000000000000000000000000000000000`<br>
Hop1 extracts: `0411111111f42099f19c17830f1107b210c6c6c91a7813ac43d099d2c0fe4f2f504fd83cbe`<br>
Hop1 forwards: `04222222220000000000000000000000000000000000000000000000000000000000000000`<br>
<br>
Hop2 input: `04222222220000000000000000000000000000000000000000000000000000000000000000`<br>
Hop2 extracts: `04222222220000000000000000000000000000000000000000000000000000000000000000`<br>
Hop2 forwards: N/A<br>
<br>
## Extra's

Further running this example you will find that we have also computed `Ephemeral Point` and `Shared Secret` @ each hop, In order to stop the tampering and
maintain confidentiality of the data @ each hop we need to perform some sort of encryption these will be needed for that but we haven't encrypted anything yet, 
it was just done for introduction, feel free to explore about it.<br>

If you are still confused not to worry we will discuss it thoroughly in next example!
