import dotenv from "dotenv";
import * as ethers from "ethers";

import { promises as fs } from "node:fs";

dotenv.config();

type TermsMessageV1Parameters = {
  version: string;
  chainId: string;
  agreements: Array<{ type: string; content_hash: string }>;
};

const TermsMessageV1 =
  "I accept the IP-NFT minting terms\n" +
  "\nI have read and agreed to the terms of the IP-NFT Assignment Agreement" +
  "\nI understand that the IP-NFT represents legal rights to IP and data of the project in my Research Agreement" +
  "\nI understand that this in an irreversible and publicly traceable transaction on the Ethereum Blockchain" +
  "\nI understand this is beta software and agree to the Terms of Service and assume all risks of minting this IP-NFT" +
  "\n" +
  "\n{agreements}" +
  "\n" +
  "\nVersion: {version}" +
  "\nChain ID: {chain-id}";

export const TermsMessage = (parameters: TermsMessageV1Parameters) =>
  TermsMessageV1.replace(
    "{agreements}",
    parameters.agreements
      .map((a) => `${a.type} Hash: ${a.content_hash}`)
      .join("\n")
  )
    .replace("{version}", parameters.version)
    .replace("{chain-id}", parameters.chainId);

const createWallet = (privateKey: string) => {
  return new ethers.Wallet(privateKey);
};

const main = async () => {
  const filePath = process.argv[2];
  const utfContent = await fs.readFile(filePath, "utf-8");
  const metadata = JSON.parse(utfContent);
  const agreements = metadata.properties.agreements;

  const message = TermsMessage({
    agreements,
    chainId: "5",
    version: "1",
  });
  console.log("Terms Message\n", message);

  const wallet = createWallet(process.env.PRIVATE_KEY as string);
  //create an EIP-191 signed message
  const termsSig = await wallet.signMessage(message);

  console.log(`Terms Signature (by ${wallet.address}):`, termsSig);
};

main();
