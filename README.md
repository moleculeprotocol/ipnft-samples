# Demo code for IP-NFT implementers

Some of these examples rely on an API key for [web3.storage](https://web3.storage). Get one and put it in a local .env file.

## Checksums

Compute and verify a file's checksum using [multiformats](https://www.npmjs.com/package/multiformats)

```
yarn ts-node ./checksum.mts
```

## Uploads

uploads sample files to IPFS using web3.storage

```
yarn ts-node ./upload.mts
```

## Schema verification

retrieves JSON schema and IP-NFT metadata from a public location and verifies its validity

```
yarn ts-node ./verifyMetadata.mts
```
