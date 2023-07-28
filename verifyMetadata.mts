/// <reference lib="dom" />
import dotenv from "dotenv";
import Ajv from "ajv";
import addFormats from "ajv-formats";
dotenv.config();

//https://testnets.opensea.io/assets/goerli/0xaf7358576C9F7cD84696D28702fC5ADe33cce0e9/73
const ipnftMetadataUri =
  "ipfs://bafkreicnc6ilzauc5e5dhyakk3e6bx3gsre7qtp4nq3b3utjv4fr4oa5f4";

async function retrieveFromIpfs(ipfsLink: string): Promise<any> {
  const ipfsGatewayUrl = ipfsLink.replace("ipfs://", "https://ipfs.io/ipfs/");
  const content = await fetch(ipfsGatewayUrl);
  return content.json();
}

(async () => {
  const ipnftSchema = await retrieveFromIpfs(
    "ipfs://bafybeihvql52zxnkksedcad5i6ptimpquu4oiek56ojldkm3ndkfoevmf4/ipnft.schema.json"
  );

  const document = await retrieveFromIpfs(ipnftMetadataUri);

  const ajv = new Ajv();
  addFormats(ajv);
  const validateIpnft = ajv.compile(ipnftSchema);
  const validationResult = validateIpnft(document);
  console.log(validationResult);
})();
