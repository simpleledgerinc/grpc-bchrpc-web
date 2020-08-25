# A BCHD gRPC client for the web

This package provides a gRPC client for connecting to [BCHD](https://bchd.cash) from web applications.  Example usage can be found at https://bchd.fountainhead.cash.  SLP support is provided when the full node has SLP index enabled, which is currently under development [here](https://github.com/simpleledgerinc/bchd).

** - For node.js applications that need to connect to a local BCHD instance you need to use the `grpc-bchrpc-node` npm package.



## Install

#### npm
`$ npm i grpc-bchrpc-web`

#### web browser
`<script src='https://unpkg.com/bchrpc'></script>`



## Build from source (from `./bchrpc.proto`)
1. Install Protocol Compiler from: https://github.com/protocolbuffers/protobuf
2. `npm i`
3. `npm run build`



## Example usage

In this simple example we create a new client that connects to `bchd.greyh.at:8335` and calls the `getRawTransaction` rpc endpoint and prints the result to the console.  We use `reversedHashOrder: true` to automatically reverse the txid endianness because BCHD expects to receive transaction hashes without endianness reversed.

```ts
let grpc = new GrpcClient();
let txid = "11556da6ee3cb1d14727b3a8f4b37093b6fecd2bc7d577a02b4e98b7be58a7e8";
let res = await grpc.getRawTransaction({ hash: txid, reversedHashOrder: true });
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

#### 0.11.0
- This update includes support for the new SLP index feature currently being tested for BCHD.  When the BCHD SLP index is enabled the full node will prevent accidental SLP token burns by rejecting invalid SLP transactions from connected gRPC clients.  This feature caused a minor change in the usage of the `SubmitTransaction()` method, where `skipSlpValidityChecks: true` needs to be added as a parameter if the BCHD full node does not have SLP indexing enabled.
- Breaking change: Replaced `reverseHash` parameter with `reversedHashOrder`.

### 0.10.5
- Add unpkg support for web browsers, updated readme instructions.

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
