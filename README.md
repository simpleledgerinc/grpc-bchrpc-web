# BCH gRPC Interface for Web Clients

## Install
`npm install grpc-bchrpc-web --save` (see [node.js](https://github.com/jcramer/grpc-bchrpc-node) version)

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
* https://bchd.greyh.at:8335
* https://bchd.imaginary.cash:8335
* https://bchd-testnet.greyh.at:18335

## Change Log

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
