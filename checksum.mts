import { CID } from "multiformats/cid";
import * as json from "multiformats/codecs/json";
import { sha256 } from "multiformats/hashes/sha2";
import { promises as fs } from "node:fs";

const checksum = async (u8: Uint8Array) => {
  //https://multiformats.io/multihash/
  const digest = await sha256.digest(u8);
  return CID.create(1, json.code, digest);
};

const verifyChecksum = async (
  u8: Uint8Array,
  _cid: string
): Promise<boolean> => {
  const cid = CID.parse(_cid);
  //https://github.com/multiformats/multicodec/blob/master/table.csv#L9
  console.log("hash algo used: 0x%s", cid.multihash.code.toString(16));

  const digest = await sha256.digest(u8);
  return cid.multihash.bytes.every((el, i) => el === digest.bytes[i]);
};

(async () => {
  const filePath = process.argv[2];
  //const binaryContent = new TextEncoder().encode("This is the content");
  const binaryContent = await fs.readFile(filePath);

  const cid = await checksum(binaryContent);
  const valid = await verifyChecksum(binaryContent, cid.toString());
  console.log(cid, binaryContent.length, valid);
})();
