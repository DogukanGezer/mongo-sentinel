import { Schema, model, Document } from 'mongoose';

interface ITest extends Document {
    _id: string;
    random: string;
}

const TestSchema = new Schema<ITest>({
    _id: { type: String, required: true },
    random: { type: String, required: true }
});

const Test = model<ITest>('test', TestSchema);

export default Test;