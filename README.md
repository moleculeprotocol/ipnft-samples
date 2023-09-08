# Demo code for IP-NFT implementers

Some of these examples rely on an API key for [web3.storage](https://web3.storage). Get one and put it in a local ` .env` file.
For the crypto-related scripts to run you need add a _private key_ of an Ethereum account as `PRIVATE_KEY`to the local`.env` file. You can copy this from your Metamask wallet.

**!!!!NEVER USE ACCOUNTS THAT YOU ALSO WOULD USE ON A MAIN NET HERE!!!!**

## Checksums

Compute and verify a file's checksum using [multiformats](https://www.npmjs.com/package/multiformats)

```
yarn ts-node ./checksum.mts <file>
```

## Uploads

uploads files to IPFS using web3.storage

```
yarn ts-node ./upload.mts <file>
```

## Lit encryption

Reads and encrypts the provided file. Requires PRIVATE_KEY to sign in with Lit

```
yarn ts-node ./lit.mts <agreement.pdf>
```

## terms signature

Reads the agreements from a preliminary ipnft.json file and assembles and signs the required terms acceptance message

```
yarn ts-node ./terms.mts <current-ipnft-json>
```

## Schema verification

retrieves JSON schema and IP-NFT metadata from a public location and verifies its validity

```
yarn ts-node ./verifyMetadata.mts ipfs://bafy...
```
