import CapturePackets from "./capturePackets";
import TestOperations from "./test";
import dotenv from "dotenv"
import Logger from "./logger";

dotenv.config()

class MongoSentinel {
    private capturePackets: CapturePackets | null = null;
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

        const Logger: Logger = await this.prepareLogger()

        this.capturePackets = await new CapturePackets('lo', 'tcp port 27017', Logger);
        this.capturePackets.start();

        this.testOperations.start();
    }

    private async prepareLogger(): Promise<Logger> {
        //get STORAGE_TYPE from env
        const storageType = process.env.STORAGE_TYPE as string;
        const logFileLocation = process.env.LOG_FILE_LOCATION as string;
        const mongoLogUri = process.env.MONGO_LOG_URI as string;

        let logger = null;
        if (storageType == 'local') {
            logger = new Logger(storageType, '', logFileLocation);
        }
        else {
            logger = new Logger(storageType, mongoLogUri, '');
        }

        return logger;
    }
}


const mongoSentinel = new MongoSentinel();
mongoSentinel.init()