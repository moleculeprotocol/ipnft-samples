import dotenv from "dotenv";
import { Web3Storage } from "web3.storage";
import fetch from "node-fetch";
import Ajv from "ajv";
import addFormats from "ajv-formats";
dotenv.config();

const w3sClient = new Web3Storage({ token: process.env.W3S_TOKEN as string });

//https://w3s.link/ipfs/bafybeifyciqacag3wev63lspuvxs3e6fe3n6mt4rwharttxgwpkcq6f5z4/ipnft.schema.json
const ipnftSchema001Cid =
  "bafkreidvntjwclitnjnk25qe6gcjxqgjthfm5ilx7rsotrnh2k2tooeara";

//https://testnets.opensea.io/assets/goerli/0x36444254795ce6E748cf0317EEE4c4271325D92A/10
const ipnftMetadataArLink = "ar://adXUYrXpfRb6JCYZVrXWxqH3v7zeB25geQvC9e6rmN0";

async function retrieveFromIpfs(cid: string): Promise<string> {
  const res = await w3sClient.get(cid);
  for await (const entry of res!.unixFsIterator()) {
    for await (const chunk of entry.content()) {
      return new TextDecoder().decode(chunk);
    }
  }
  throw "not found";
}

async function retrieveFromArweave(arLink: string) {
  const arGatewayUrl = arLink.replace("ar://", "https://arweave.net/");
  return await (await fetch(arGatewayUrl)).json();
}

(async () => {
  const ipnftSchema = JSON.parse(await retrieveFromIpfs(ipnftSchema001Cid));
  const document = await retrieveFromArweave(ipnftMetadataArLink);

  const ajv = new Ajv();
  addFormats(ajv);
  const validateIpnft = ajv.compile(ipnftSchema);
  const validationResult = validateIpnft(document);
  console.log(validationResult);
})();
