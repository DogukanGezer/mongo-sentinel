export class Request {
    operation: string;
    query: any;
    ordered: boolean;
    lsid: string;
    txnNumber: number;
    timestamp: Date;
    database: string;

    constructor(operation: string, query: any, ordered: boolean, lsid: string, txnNumber: number, timestamp: Date, database: string) {
        this.operation = operation;
        this.query = query;
        this.ordered = ordered;
        this.lsid = lsid;
        this.txnNumber = txnNumber;
        this.timestamp = timestamp;
        this.database = database;
    }
}