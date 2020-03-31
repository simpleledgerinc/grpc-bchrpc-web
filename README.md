# BCHD gRPC Client for Web and node.js

This pacakge provides a client for connecting to BCHD from either web browser or node.js.  To use with node.js see extra requirements below.

## Install
`npm i grpc-bchrpc-web`

## Build from source (from `./bchrpc.proto`)
1. Install Protocol Compiler from: https://github.com/protocolbuffers/protobuf
2. `npm install`
3. `npm run build && tsc`

## Example usage

In this simple example we create a new client that connects to `bchd.greyh.at:8335` by default.  We call `getRawTransaction` and then print the results to the console.  We use `reverseOrder` in call to getRawTransaction because BCHD works with transaction hash not the conventional reversed hash/txid.

```ts
let grpc = new GrpcClient();
let txid = "11556da6ee3cb1d14727b3a8f4b37093b6fecd2bc7d577a02b4e98b7be58a7e8";
let res = await grpc.getRawTransaction({ hash: txid, reverseOrder: true });
console.log(Buffer.from(res.getTransaction_asU8()).toString('hex'));
```

## BCHD Full Nodes w/ gRPC
Mainnet:
* https://bchd.greyh.at:8335
* https://bchd.imaginary.cash:8335
* https://bchd.fountainhead.cash:443

Testnet:
* https://bchd.greyh.at:18335
* https://bchd-testnet.greyh.at:18335

## Use with node.js

This package can be used with node.js by including DOM library imports with a compiler (e.g., TypeScript).  The BCHD instance needs to be behind a reverse proxy server (e.g., `https://bchd.greyh.at:8335`), connecting to a local instance of BCHD requires use of the `grpc-bchrpc-node` npm package.

First, add "DOM" as a library to compile the source with, for example, in your `tsconfig.json`:

```
{
  "compilerOptions": {
    "lib": ["es2015", "es2017", "esnext", "DOM"],
    ...
  }
  ...
}
```

Next, add the imports to your code:
```
// Do this first, so that we can call this library from node.
import { grpc, GrpcClient, NodeHttpTransport } from "grpc-bchrpc-web";
grpc.setDefaultTransport(NodeHttpTransport());

let client = new GrpcClient();
// calls to your client
...

```

## Change Log

### 0.10.4
- Updates for node.js transport 

### 0.10.3
- Add method `getRawMempool`

### 0.10.2
- Add method `getUnspentOutput`
- Some linting

### 0.10.1
- Hot fix update in tsconfig

### 0.10.0
- Add `subscribeTransactions` and `subscribeBlocks` methods
- Update `submitTransaction` to match node version
- Add unit tests
- Add coverage for unit tests

### 0.9.0
- Add `submitTransaction` method
- Bump `max_receive_message_length` to unlimited

### 0.8.0
- Add `getBlock` methood

### 0.7.2
- Add all available parameters to `GetAddressTransactionsRequest`

### 0.7.1
- Add typscript to dev dependencies

### 0.7.0
- Add `getAddressTransactions` method
- Support block hash in `GetBlockInfo` method

### 0.6.1
- Update `bchrpc.proto` per BCHD commit [31e5e87](https://github.com/gcash/bchd/blob/master/bchrpc/bchrpc.proto)

### 0.6.0
- Update `bchrpc.proto` per BCHD commit [6f19bfe](https://github.com/gcash/bchd/blob/master/bchrpc/bchrpc.proto)
- Use destructured params in Client constructor
- Moved tsc to the end of `npm run build` script
- Renamed Client to GrpcClient to be consistent with `grpc-bchrpc-node`
