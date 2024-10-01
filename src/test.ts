import mongoose from "mongoose"
import TestSchema from "./models/Test";
import Test from "./models/Test";

export default class TestOperations {
    private connectionString: string;

    constructor(connectionString: string) {
        this.connectionString = connectionString;
    }

    private async connect() {
        try {
            const connection = await mongoose.connect(this.connectionString);
            if (connection.connection.readyState) {
                console.log("connected to mongo");
            }
        }
        catch (e: any) {
            throw new Error(e);
        }

    }
    public async start() {
        await this.connect();
        await this.deleteAllRecords();

        console.log('starting insert cases');
        this.startInsert();
        await this.timeOut(2000);

        console.log('starting delete cases');
        this.startDelete();
        await this.timeOut(2000);

        console.log('starting update cases');
        this.startUpdate();
        await this.timeOut(10000);
    }

    private async deleteAllRecords() {
        try {
            await TestSchema.deleteMany({});
        } catch (e: any) {
            throw new Error(`Failed to delete all records: ${e.message}`);
        }
    }
    private async startInsert() {
        let startIndex = 0;
        while (startIndex < 100) {
            try {
                const random = (Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER - 10000 + 1)) + 10000).toString(16);
                const FakeData = new TestSchema({
                    _id: startIndex.toString(),
                    random: random,
                })

                await FakeData.save();
                startIndex++;
                await this.timeOut(1000);
            } catch (e: any) {
                throw new Error(`Failed to save FakeData: ${e.message}`);
            }
        }
    }

    private async startDelete() {
        let startIndex = 0;
        while (startIndex < 100) {
            try {
                const documentCount = await TestSchema.countDocuments();
                const randomDocument = await TestSchema.findOne().skip(Math.floor(Math.random() * documentCount));
                if (!randomDocument) {
                    await this.timeOut(1000);
                    continue;
                }

                await TestSchema.deleteOne({ _id: randomDocument._id });
                startIndex++;

                await this.timeOut(1000);
            } catch (e: any) {
                throw new Error(`Failed to delete FakeData: ${e.message}`);
            }
        }
    }

    private async startUpdate() {
        let startIndex = 0;
        while (startIndex < 100) {
            try {
                //get random document
                const documentCount = await TestSchema.countDocuments();
                const randomDocument = await TestSchema.findOne().skip(Math.floor(Math.random() * documentCount));
                if (documentCount === 0) {
                    await this.timeOut(1000);
                    continue;
                }

                const random = (Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER - 10000 + 1)) + 10000).toString(16);
                await TestSchema.updateOne({ _id: startIndex.toString() }, { random: random });
                startIndex++;

                await this.timeOut(1000);
            } catch (e: any) {
                throw new Error(`Failed to update FakeData: ${e.message}`);
            }
        }
    }

    private timeOut(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}