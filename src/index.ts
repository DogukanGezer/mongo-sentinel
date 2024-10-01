import CapturePackets from "./capturePackets";
import TestOperations from "./test";
import dotenv from "dotenv"

dotenv.config()

class MongoSentinel {
    private capturePackets: CapturePackets = new CapturePackets("lo", "tcp port 27017")
    private testOperations: TestOperations;

    constructor() {
        const connectionString: string = process.env.MONGO_URI as string;
        if (connectionString == undefined) {
            console.log("connection string not passed");
        }

        this.testOperations = new TestOperations(connectionString)
    }

    public async init() {
        console.log("capturing packets...");
        this.capturePackets.start();
        this.testOperations.start();

    }
}


const mongoSentinel = new MongoSentinel();
mongoSentinel.init()