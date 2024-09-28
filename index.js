const pcap = require('pcap');
const mongoose = require('mongoose');
const bson = require('bson');
require('dotenv').config();




async function init() {
    const pcapSession = pcap.createSession('lo', {
        filter: "tcp port 27017"
    });

    pcapSession.on('packet', async (rawPacket) => {
        const packet = pcap.decode.packet(rawPacket);
        const tcpData = packet.payload.payload.payload.data;

        if (!tcpData) { return; }

        let msgHeader = {
            messageLength: tcpData.readInt32LE(0),
            requestId: tcpData.readInt32LE(4),
            responseTo: tcpData.readInt32LE(8),
            opCode: tcpData.readInt32LE(12)
        }
        if (msgHeader.opCode != 2013) { return; }
        const flagBits = tcpData.readInt32LE(16);

        // Check required bits (0-15)
        const requiredBits = flagBits & 0xFFFF;
        if (requiredBits & 0xFFFE) { return;}

        // Optional bits (16-31)
        const optionalBits = flagBits >>> 16;
        // No need to check optional bits, just log them
       
        const kind = tcpData.readInt8(20);//flagbit starts from the 17th byte of the message int32 u need shift 16 bits to get the flag bit

        console.log(kind,'-')
        if (kind !== 0) {
            console.log('Unsupported section kind:', kind);
            return;
        }   

        const bsonSize = tcpData.readInt32LE(21);
        const bsonData = tcpData.slice(21, 21 + bsonSize);

        try {
            const bsonObject = bson.deserialize(bsonData);
            console.log('BSON:', JSON.stringify(bsonObject, null, 2));
            if (bsonObject.updates) {
                console.log('Update:', bson.updates);
            }
        } catch (error) {
            console.error('Failed to deserialize BSON:', error);
        }
    });
}

const fakeData = {
    _id: 1,
    random: "123"
}


async function mongoInit(connectionString) {
    console.log('Connecting to MongoDB', connectionString);
    const connection = await mongoose.connect(connectionString)
    console.log('Connected to MongoDB');
    return connection;
}


async function faker() {
    const connection = await mongoInit(process.env.MONGO_URI);
    const db = connection.connection.db;
    const collection = db.collection('test');

    const promise = await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('done');
        }, 2000);
    });

    console.log('Faking data...');
    setInterval(async () => {
        const record = await collection.findOne({ _id: 1 })
        if (!record) {
            await collection.insertOne(fakeData);
        }
        else {
            let random = Math.floor(Math.random() * 1000000);
            random = random.toString(29);
            await collection.updateOne({ _id: 1 }, { $set: { random: random } });
        }
        //remove interval
    }, 1000);
}



faker()
init();
