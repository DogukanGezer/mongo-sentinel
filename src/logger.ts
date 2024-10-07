import { Request } from "./entities/Request";
import { LogTrnx } from "./models/LogTrnx";
import { Long, Timestamp } from "bson";
import mongoose from "mongoose";
import fs from "fs";

export default class Logging {
    private log_platform: string;
    private connectionString: string;
    private path: string;
    private fileLocation: string | null = null;

    constructor(log_platform: string, connectionString: string, path: string) {
        this.log_platform = log_platform;
        this.connectionString = connectionString;
        this.path = path;

        if (log_platform != 'local') {
            this.connect();
            this.save = this.mongodb;
        }
        else {
            this.generateLogFiles(path);
            this.save = this.localStorage;
        }
    }

    private async generateLogFiles(path: string): Promise<void> {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);


        }
        const isoDate = new Date().toISOString().split('T')[0];

        if (!fs.existsSync(`${path}/${isoDate}.log`)) {
            fs.writeFileSync(`${path}/${isoDate}.log`, '');
        }

        this.fileLocation = `${path}/${isoDate}.log`;
    }

    public async save(request: Request) { }

    private async localStorage(request: Request) {
        if (request.collectionName == LogTrnx.collection.name) { return; }
        await fs.appendFileSync(this.fileLocation as string, JSON.stringify(request) + '\n');
    }

    private async connect(): Promise<boolean> {
        const connection = await mongoose.connect(this.connectionString);
        if (connection.connection.readyState) {
            console.log("connected to logging database");
            return true;
        }
        else {
            return false;
        }
    }

    private async mongodb(request: Request) {
        if (request.collectionName == LogTrnx.collection.name) { return; }

        const logTrnx = new LogTrnx({
            operation: request.operation,
            query: request.query,
            ordered: request.ordered,
            lsid: request.lsid,
            txnNumber: request.txnNumber,
            timestamp: request.timestamp,
            database: request.database,
            collectionName: request.collectionName
        });

        await logTrnx.save();
    }
}