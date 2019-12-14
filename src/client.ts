import * as bchrpc from '../pb/bchrpc_pb'
import * as bchrpc_pb_service from '../pb/bchrpc_pb_service'

export class GrpcClient {
    client: bchrpc_pb_service.bchrpcClient;

    constructor({ url = undefined, testnet = false, options }: { url?: string; testnet?: boolean; options?: object } = {}) {
        if(!url && !testnet) {
            url = "https://bchd.greyh.at:8335";
        } else if(!url) {
            url = "https://bchd-testnet.greyh.at:18335";
        }
        if (!options) {
            options = {
                "grpc.max_receive_message_length": -1, // unlimited
            };
        }
        this.client = new bchrpc_pb_service.bchrpcClient(url)
    }

    getMempoolInfo(): Promise<bchrpc.GetMempoolInfoResponse> {
        return new Promise((resolve, reject) => {
            this.client.getMempoolInfo(new bchrpc.GetMempoolInfoRequest(), (err, data) => {
                if (err !== null) reject(err);
                else resolve(data!);
            });
        });
    }

    getRawTransaction({ hash, reverseOrder }: { hash: string; reverseOrder?: boolean; }): Promise<bchrpc.GetRawTransactionResponse> {
        let req = new bchrpc.GetRawTransactionRequest();
        if(reverseOrder)
            req.setHash(new Uint8Array(hash.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))).reverse());
        else
            req.setHash(new Uint8Array(hash.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))));
        return new Promise((resolve, reject) => {
            this.client.getRawTransaction(req, (err, data) => {
                if(err!==null) reject(err);
                else resolve(data!);
            })
        });
    }

    getTransaction({ hash, reverseOrder }: { hash: string; reverseOrder?: boolean; }): Promise<bchrpc.GetTransactionResponse> {
        let req = new bchrpc.GetTransactionRequest();
        if(reverseOrder)
            req.setHash(new Uint8Array(hash.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))).reverse());
        else
            req.setHash(new Uint8Array(hash.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))));
        return new Promise((resolve, reject) => {
            this.client.getTransaction(req, (err, data) => {
                if(err!==null) reject(err);
                else resolve(data!);
            })
        })
    }

    getAddressTransactions({ address, nbSkip, nbFetch, height, hash, reversedHashOrder }: { address: string, nbSkip?: number, nbFetch?: number, height?: number, hash?: string, reversedHashOrder?: boolean }): Promise<bchrpc.GetAddressTransactionsResponse> {
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
            if(reversedHashOrder) {
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

    getAddressUtxos(address: string): Promise<bchrpc.GetAddressUnspentOutputsResponse> {
        let req = new bchrpc.GetAddressUnspentOutputsRequest()
        req.setAddress(address);
        return new Promise((resolve, reject) => {
            this.client.getAddressUnspentOutputs(req, (err, data) => {
                if(err!==null) reject(err);
                else resolve(data!);
            })
        })
    }

    getRawBlock({ hash, reverseOrder }: { hash: string; reverseOrder?: boolean; }): Promise<bchrpc.GetRawBlockResponse> {
        let req = new bchrpc.GetRawBlockRequest();
        if(reverseOrder)
            req.setHash(new Uint8Array(hash.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))).reverse());
        else
            req.setHash(new Uint8Array(hash.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))));
        return new Promise((resolve, reject) => {
            this.client.getRawBlock(req, (err, data) => {
                if(err!==null) reject(err);
                else resolve(data!);
            })
        })
    }

    getBlock({ index, hash, reversedHashOrder, fullTransactions }:
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

    getBlockInfo({ index, hash, reversedHashOrder }:
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

    getBlockchainInfo(): Promise<bchrpc.GetBlockchainInfoResponse> {
        return new Promise((resolve, reject) => {
            this.client.getBlockchainInfo(new bchrpc.GetBlockchainInfoRequest(), (err, data) => {
                if(err!==null) reject(err);
                else resolve(data!);
            })
        })
    }

    public submitTransaction(txn: Uint8Array): Promise<bchrpc.SubmitTransactionResponse> {
        let txnBase64: string;
        const req = new bchrpc.SubmitTransactionRequest();
        req.setTransaction(txn);
        return new Promise((resolve, reject) => {
            this.client.submitTransaction(req, (err, data) => {
                if (err !== null) { reject(err); } else { resolve(data!); }
            });
        });
    }
}
