import mongoose from "mongoose"
import TestSchema from "./models/Test";

export default class TestOperations {
    private connectionString: string;
    private mongoose: mongoose.Mongoose;

    constructor(connectionString: string) {
        this.connectionString = connectionString;
        this.mongoose = new mongoose.Mongoose();
    }

    private async connect() {
        try {
            const connection = await this.mongoose.connect(this.connectionString);
        }
        catch (e: any) {
            throw new Error(e);
        }

    }
    public async start() {
        await this.connect();
        await this.startInsert();
    }

    private async startInsert() {
        const FakeData = new TestSchema({
            random: "random",
        })

        try {
            await FakeData.save();
        } catch (e: any) {
            throw new Error(`Failed to save FakeData: ${e.message}`);
        }
    }
}