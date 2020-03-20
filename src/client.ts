import { Buffer } from "buffer";
import * as bchrpc from "../pb/bchrpc_pb";
import * as bchrpc_pb_service from "../pb/bchrpc_pb_service";

export class GrpcClient {
    public client: bchrpc_pb_service.bchrpcClient;

    constructor({ url, testnet = false, options }:
        { url?: string; testnet?: boolean; options?: object } = {}) {
        if (!url && !testnet) {
            url = "https://bchd.greyh.at:8335";
        } else if (!url) {
            url = "https://bchd-testnet.greyh.at:18335";
        }
        if (!options) {
            options = {
                "grpc.max_receive_message_length": -1, // unlimited
            };
        }
        this.client = new bchrpc_pb_service.bchrpcClient(url);
    }

    public getMempoolInfo(): Promise<bchrpc.GetMempoolInfoResponse> {
        return new Promise((resolve, reject) => {
            this.client.getMempoolInfo(new bchrpc.GetMempoolInfoRequest(), (err, data) => {
                if (err !== null) { reject(err); } else { resolve(data!); }
            });
        });
    }

    public getRawTransaction({ hash, reverseOrder, reversedHashOrder }:
        { hash: string; reverseOrder?: boolean; reversedHashOrder?: boolean }):
        Promise<bchrpc.GetRawTransactionResponse> {
        const req = new bchrpc.GetRawTransactionRequest();
        if (reverseOrder || reversedHashOrder) {
            req.setHash(new Uint8Array(hash.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))).reverse());
        } else {
            req.setHash(new Uint8Array(hash.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))));
        }
        return new Promise((resolve, reject) => {
            this.client.getRawTransaction(req, (err, data) => {
                if (err !== null) { reject(err); } else { resolve(data!); }
            });
        });
    }

    public getTransaction({ hash, reverseOrder, reversedHashOrder }:
        { hash: string; reverseOrder?: boolean; reversedHashOrder?: boolean }): Promise<bchrpc.GetTransactionResponse> {
        const req = new bchrpc.GetTransactionRequest();
        if (reverseOrder || reversedHashOrder) {
            req.setHash(new Uint8Array(hash.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))).reverse());
        } else {
            req.setHash(new Uint8Array(hash.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))));
        }
        return new Promise((resolve, reject) => {
            this.client.getTransaction(req, (err, data) => {
                if (err !== null) { reject(err); } else { resolve(data!); }
            });
        });
    }

    public getAddressTransactions({ address, nbSkip, nbFetch, height, hash, reversedHashOrder }:
        { address: string, nbSkip?: number, nbFetch?: number, height?: number, hash?: string, 
            reversedHashOrder?: boolean }): Promise<bchrpc.GetAddressTransactionsResponse> {
        const req = new bchrpc.GetAddressTransactionsRequest();
        if (nbSkip) {
            req.setNbSkip(nbSkip);
        }
        if (nbFetch) {
            req.setNbFetch(nbFetch);
        }
        if (height) {
            req.setHeight(height);
        }
        if (hash) {
            if (reversedHashOrder) {
                req.setHash(new Uint8Array(hash.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))).reverse());
            } else {
                req.setHash(new Uint8Array(hash.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))));
            }
        }
        req.setAddress(address);
        return new Promise((resolve, reject) => {
            this.client.getAddressTransactions(req, (err, data) => {
                if (err !== null) { reject(err); } else { resolve(data!); }
            });
        });
    }

    public getAddressUtxos({ address, includeMempool }:
        { address: string, includeMempool: boolean }): Promise<bchrpc.GetAddressUnspentOutputsResponse> {
        const req = new bchrpc.GetAddressUnspentOutputsRequest();
        req.setAddress(address);
        if (includeMempool) {
            req.setIncludeMempool(true);
        }
        return new Promise((resolve, reject) => {
            this.client.getAddressUnspentOutputs(req, (err, data) => {
                if (err !== null) { reject(err); } else { resolve(data!); }
            });
        });
    }

    public getRawBlock({ hash, reverseOrder, reversedHashOrder }:
        { hash: string; reverseOrder?: boolean; reversedHashOrder?: boolean }): Promise<bchrpc.GetRawBlockResponse> {
        const req = new bchrpc.GetRawBlockRequest();
        if (reverseOrder || reversedHashOrder) {
            req.setHash(new Uint8Array(hash.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))).reverse());
        }
        else {
            req.setHash(new Uint8Array(hash.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))));
        }
        return new Promise((resolve, reject) => {
            this.client.getRawBlock(req, (err, data) => {
                if (err !== null) { reject(err); }
                else { resolve(data!); }
            })
        })
    }

    public getBlock({ index, hash, reversedHashOrder, fullTransactions }:
        { index?: number, hash?: string, reversedHashOrder?: boolean,
            fullTransactions?: boolean }): Promise<bchrpc.GetBlockResponse> {
        const req = new bchrpc.GetBlockRequest();
        if (index !== null && index !== undefined) {
            req.setHeight(index);
        } else if (hash) {
            if (reversedHashOrder) {
                req.setHash(new Uint8Array(hash.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))).reverse());
            } else {
                req.setHash(new Uint8Array(hash.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))));
            }
        } else {
            throw Error("No index or hash provided for block");
        }
        if (fullTransactions) {
            req.setFullTransactions(true);
        }
        return new Promise((resolve, reject) => {
            this.client.getBlock(req, (err, data) => {
                if (err !== null) { reject(err); } else { resolve(data!); }
            });
        });
    }

    public getBlockInfo({ index, hash, reversedHashOrder }:
        { index?: number, hash?: string, reversedHashOrder?: boolean }): Promise<bchrpc.GetBlockInfoResponse> {
        const req = new bchrpc.GetBlockInfoRequest();
        if (index !== null && index !== undefined) { req.setHeight(index); } else if (hash) {
            if (reversedHashOrder) {
                req.setHash(new Uint8Array(hash.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))).reverse());
            } else {
                req.setHash(new Uint8Array(hash.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))));
            }
        } else {
            throw Error("No index or hash provided for block");
        }
        return new Promise((resolve, reject) => {
            this.client.getBlockInfo(req, (err, data) => {
                if (err !== null) { reject(err); } else { resolve(data!); };
            });
        });
    }

    public getBlockchainInfo(): Promise<bchrpc.GetBlockchainInfoResponse> {
        return new Promise((resolve, reject) => {
            this.client.getBlockchainInfo(new bchrpc.GetBlockchainInfoRequest(), (err, data) => {
                if (err !== null) { reject(err); } else { resolve(data!); }
            });
        });
    }

    public subscribeTransactions({ includeMempoolAcceptance, includeBlockAcceptance, includeSerializedTxn }:
        { includeMempoolAcceptance?: boolean, includeBlockAcceptance?: boolean, includeSerializedTxn?: boolean },
        ): Promise<bchrpc_pb_service.ResponseStream<bchrpc.TransactionNotification>> {
        return new Promise((resolve, reject) => {
            const req = new bchrpc.SubscribeTransactionsRequest();
            includeMempoolAcceptance ? req.setIncludeMempool(true) : req.setIncludeMempool(false);
            includeBlockAcceptance ? req.setIncludeInBlock(true) : req.setIncludeInBlock(false);
            includeSerializedTxn ? req.setSerializeTx(true) : req.setSerializeTx(false);
            const filter = new bchrpc.TransactionFilter();
            filter.setAllTransactions(true);
            req.setSubscribe(filter);
            try {
                resolve(this.client.subscribeTransactions(req));
            } catch (err) {
                reject(err);
            }
        });
    }

    public subscribeBlocks({ includeSerializedBlock, includeTxnHashes, includeTxnData }:
        { includeSerializedBlock?: boolean, includeTxnHashes?: boolean, includeTxnData?: boolean },
        ): Promise<bchrpc_pb_service.ResponseStream<bchrpc.BlockNotification>> {
        return new Promise((resolve, reject) => {
            const req = new bchrpc.SubscribeBlocksRequest();
            includeTxnHashes ? req.setFullBlock(true) : req.setFullBlock(false);
            includeTxnData ? req.setFullTransactions(true) : req.setFullTransactions(false);
            includeSerializedBlock ? req.setSerializeBlock(true) : req.setSerializeBlock(false);
            try {
                resolve(this.client.subscribeBlocks(req));
            } catch (err) {
                reject(err);
            }
        });
    }

    public submitTransaction({ txnBuf, txnHex, txn }:
        { txnBuf?: Buffer, txnHex?: string, txn?: Uint8Array }): Promise<bchrpc.SubmitTransactionResponse> {
        let tx: string|Uint8Array;
        const req = new bchrpc.SubmitTransactionRequest();
        if (txnBuf) {
            tx = txnBuf.toString("base64");
        } else if (txnHex) {
            tx = Buffer.from(txnHex, "hex").toString("base64");
        } else if (txn) {
            tx = txn;
        } else {
            throw Error("Most provide either Hex string, Buffer, or Uint8Array");
        }
        req.setTransaction(tx);
        return new Promise((resolve, reject) => {
            this.client.submitTransaction(req, (err, data) => {
                if (err !== null) { reject(err); } else { resolve(data!); }
            });
        });
    }
}
