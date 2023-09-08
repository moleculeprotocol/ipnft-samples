import dotenv from "dotenv";
import { Blob } from "node:buffer";
import { Web3Storage } from "web3.storage";
import { promises as fs } from "node:fs";
dotenv.config();

const w3sClient = new Web3Storage({ token: process.env.W3S_TOKEN as string });

(async () => {
  const filePath = process.argv[2];
  const utfContent = await fs.readFile(filePath, "utf-8");

  const binaryContent = new Blob([utfContent], {
    type: "application/json",
  });

  const file = {
    name: "metadata.json",
    stream: () => binaryContent.stream(),
  };

  //@ts-ignore
  const cid = await w3sClient.put([file], {
    name: "metadata.json",
    wrapWithDirectory: false,
  });
  console.log(cid);
})();
