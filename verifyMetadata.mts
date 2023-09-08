/// <reference lib="dom" />
import Ajv from "ajv";
import addFormats from "ajv-formats";
import dotenv from "dotenv";

dotenv.config();

async function retrieveFromIpfs(ipfsLink: string): Promise<any> {
  const ipfsGatewayUrl = ipfsLink.replace("ipfs://", "https://ipfs.io/ipfs/");
  const content = await fetch(ipfsGatewayUrl);
  return content.json();
}

(async () => {
  const ipnftSchema = await retrieveFromIpfs(
    "ipfs://bafybeihvql52zxnkksedcad5i6ptimpquu4oiek56ojldkm3ndkfoevmf4/ipnft.schema.json"
  );

  const ipfsLocation = process.argv[2];
  const document = await retrieveFromIpfs(ipfsLocation);

  const ajv = new Ajv();
  addFormats(ajv);
  const validateIpnft = ajv.compile(ipnftSchema);
  const validationResult = validateIpnft(document);
  console.log(validationResult);
})();
