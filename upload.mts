import dotenv from "dotenv";
import { Blob } from "node:buffer";
import { Web3Storage } from "web3.storage";
dotenv.config();

const w3sClient = new Web3Storage({ token: process.env.W3S_TOKEN as string });

(async () => {
  const content = {
    uploaded_at: new Date().toISOString(),
  };

  const binaryContent = new Blob([JSON.stringify(content)], {
    type: "application/json",
  });

  const file = {
    name: "filename.json",
    stream: () => binaryContent.stream(),
  };

  //@ts-ignore
  const cid = await w3sClient.put([file], {
    name: "some.json",
    wrapWithDirectory: false,
  });
  console.log(cid);
})();
