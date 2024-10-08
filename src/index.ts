import CapturePackets from "./capturePackets";
import TestOperations from "./test";
import dotenv from "dotenv"
import Logger from "./logger";

dotenv.config()

class MongoSentinel {
    private driver: string = process.env.DRIVER as string;
    private port: string = process.env.LISTEN_PORT as string;
    private capturePackets: CapturePackets | null = null;
    private testOperations: TestOperations;
    private activeTest: boolean = process.env.TEST as unknown as boolean;

    constructor() {
        const connectionString: string = process.env.MONGO_URI as string;
        if (connectionString == undefined) {
            console.log("connection string not passed");
        }

        this.testOperations = new TestOperations(connectionString)
    }

    public async init() {
        const Logger: Logger = await this.prepareLogger()

        this.capturePackets = await new CapturePackets(this.driver, `tcp port ${this.port}`, Logger);
        this.capturePackets.start();

        if (this.activeTest) {
            this.testOperations.start();
        }
    }

    private async prepareLogger(): Promise<Logger> {
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