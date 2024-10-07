import { Schema, model, Document } from 'mongoose';

interface IRequest extends Document {
    operation: string;
    query: any[];
    ordered: boolean;
    lsid: string;
    txnNumber: number;
    timestamp: Date;
    database: string;
    collectionName: string;
}

const RequestSchema = new Schema<IRequest>({
    operation: { type: String, required: true },
    query: { type: Schema.Types.Mixed, required: true },
    ordered: { type: Boolean, required: true },
    lsid: { type: String, required: true },
    txnNumber: { type: Number, required: false },
    timestamp: { type: Date, required: true },
    database: { type: String, required: true },
    collectionName: { type: String, required: true }
});

//create index for timestamp

const LogTrnx = model<IRequest>('sentinellogtrnxs', RequestSchema);

export { LogTrnx, IRequest };