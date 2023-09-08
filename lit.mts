import dotenv from "dotenv";
import * as ethers from "ethers";
import siwe from "siwe";
import LitJsSdk, {
  LitNodeClientNodeJs,
} from "@lit-protocol/lit-node-client-nodejs";
import { hexlify, Wallet } from "ethers";
import { promises as fs } from "node:fs";

dotenv.config();

const createWallet = (privateKey: string) => {
  return new ethers.Wallet(privateKey);
};

const obtainAuthSig = async (wallet: Wallet) => {
  const address = ethers.getAddress(await wallet.getAddress());

  // Craft the SIWE message
  const domain = "localhost";
  const origin = "https://localhost/login";
  const statement = "This proves that we're controlling our address";
  const siweMessage = new siwe.SiweMessage({
    domain,
    address: address,
    statement,
    uri: origin,
    version: "1",
    chainId: 5,
  });
  const messageToSign = siweMessage.prepareMessage();

  // Sign the message and format the authSig
  const signature = await wallet.signMessage(messageToSign);

  return {
    sig: signature,
    derivedVia: "web3.eth.personal.sign",
    signedMessage: messageToSign,
    address: address,
  };
};

//see https://developer.litprotocol.com/v2/accessControl/EVM/customContractCalls#must-posess-at-least-one-erc1155-token-with-a-given-token-id
const makeAccessControlConditions = (ipnftId: string) => {
  return [
    {
      contractAddress: "0xaf7358576C9F7cD84696D28702fC5ADe33cce0e9",
      chain: "goerli",
      functionName: "canRead",
      functionParams: [":userAddress", ipnftId],
      functionAbi: {
        inputs: [
          {
            internalType: "address",
            name: "reader",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "canRead",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      returnValueTest: {
        key: "",
        comparator: "=",
        value: "true",
      },
    },
  ];
};

const encryptWithLit = async (
  client: LitNodeClientNodeJs,
  binaryContent: Blob,
  wallet: Wallet
) => {
  //note that the symmetric key is visible here!
  const { encryptedFile, symmetricKey } = await LitJsSdk.encryptFile({
    file: binaryContent,
  });

  const authSig = await obtainAuthSig(wallet);
  const accessControlConditions = makeAccessControlConditions("32");

  const encryptedSymmetricKey = await client.saveEncryptionKey({
    accessControlConditions,
    symmetricKey,
    authSig,
    chain: "goerli",
  });

  return { accessControlConditions, encryptedFile, encryptedSymmetricKey };
};

const main = async () => {
  const filePath = process.argv[2];
  //const binaryContent = new TextEncoder().encode("This is the content");
  const fileContent = await fs.readFile(filePath);

  const client = new LitJsSdk.LitNodeClientNodeJs({});
  await client.connect();

  const wallet = createWallet(process.env.PRIVATE_KEY as string);

  const binaryContent = new Blob([fileContent], {
    type: "application/octet-stream",
  });

  const { accessControlConditions, encryptedFile, encryptedSymmetricKey } =
    await encryptWithLit(client, binaryContent, wallet);

  await fs.writeFile(
    "./uploads/file.enc",
    Buffer.from(await encryptedFile.arrayBuffer())
  );

  console.log(
    JSON.stringify(
      {
        accessControlConditions,
        encryptedSymmetricKey: hexlify(encryptedSymmetricKey),
      },
      null,
      2
    )
  );
};

main();
