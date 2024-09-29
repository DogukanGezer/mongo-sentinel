import CapturePackets from "./capturePackets";


class MongoSentinel {
    private capturePackets: CapturePackets = new CapturePackets("lo", "tcp port 27017")

    public async init() {
        console.log("capturing packets...")
        this.capturePackets.start()
    }
}


const mongoSentinel = new MongoSentinel();
mongoSentinel.init()