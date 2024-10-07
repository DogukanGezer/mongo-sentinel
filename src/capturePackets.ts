'use strict';

import pcap from "pcap";
import bson, { BSON, Document } from "bson";
import { MsgHeader } from "./entities/MsgHeader";
import { OpMsg } from "./entities/OpMsg";
import { OpCodeValueObject } from "./valueObjects/OpCodes";
import { Request } from "./entities/Request";
import Logger from "./logger";

export default class CapturePackets {
    private pcap_session: any;
    private logger: Logger;

    constructor(driver: string, filter: string, logger: Logger) {
        this.pcap_session = pcap.createSession(driver, {
            filter: filter
        });
        this.logger = logger;
    }

    public async start() {
        console.log("creating pcap session...");
        this.pcap_session.on("packet", async (raw_packet: any) => {
            const ipPacet = pcap.decode.packet(raw_packet);

            const tcpPacket = ipPacet.payload.payload.payload.data
            if (!tcpPacket) { return; }

            const buffer: Buffer = Buffer.from(tcpPacket);

            const messageHeader: MsgHeader = await this.parseHeader(buffer);
            if (!new OpCodeValueObject(messageHeader.opCode).equals(2013)) { return; }

            const bodyKind: number = await this.parseBodyKind(buffer);
            if (bodyKind != 0) { return; }

            const opMSG = await this.parseOpMsg(messageHeader, buffer);
            if (opMSG == null) { return; }

            const schema = await this.prepareSchema(opMSG);
            if (schema == null) { return; }

            await this.logger.save(schema);
        });
    }

    private async parseHeader(buffer: Buffer): Promise<MsgHeader> {
        return new MsgHeader(
            buffer.readInt32LE(0),
            buffer.readInt32LE(4),
            buffer.readInt32LE(8),
            buffer.readInt32LE(12)
        )
    }

    private async parseBodyKind(buffer: Buffer): Promise<number> {
        return buffer.readInt8(20);
    }
    private async parseOpMsg(messageHeader: MsgHeader, buffer: Buffer): Promise<OpMsg | null> {
        const flagBits = buffer.readInt32LE(16);
        const optionalBits = flagBits >>> 16;
        const bsonSize = buffer.readInt32LE(21);
        const bsonData = buffer.slice(21, 21 + bsonSize);

        const bson = await this.parseBson(bsonData);
        const section = JSON.parse(JSON.stringify(bson));

        return new OpMsg(
            messageHeader,
            optionalBits,
            [section],
            0
        );

    }

    private async parseBson(buffer: Buffer): Promise<Document | null> {
        try {
            return bson.deserialize(buffer);
        }
        catch (e: any) {
            return null
        }
    }

    private async prepareSchema(opMessage: OpMsg): Promise<Request | null> {
        //i am using sections as array bc it not came in single request, but i can't handle it.
        const keys = Object.keys(opMessage.sections[0]);
        const message: any = opMessage.sections[0];

        let schema: Request | null = null;

        const timestamp = await this.parseTimestamp(message.$clusterTime.clusterTime.$timestamp);
        if (keys.includes('insert')) {
            schema = new Request(
                'insert',
                message.documents,
                message.ordered,
                message.lsid.id,
                message.txnNumber,
                timestamp,
                message['$db'],
                message.insert
            )

        }
        if (keys.includes('delete')) {
            schema = new Request(
                'delete',
                message.deletes,
                message.ordered,
                message.lsid.id,
                message.txnNumber,
                timestamp,
                message['$db'],
                message.delete
            )
        }
        if (keys.includes('update')) {
            schema = new Request(
                'update',
                message.updates,
                message.ordered,
                message.lsid.id,
                message.txnNumber,
                timestamp,
                message['$db'],
                message.update
            )
        }

        return schema;
    }

    private async parseTimestamp(timestamp: number): Promise<Date> {
        const bsonTimestamp = bson.Long.fromString(timestamp.toString());
        const timestampObj = new bson.Timestamp(bsonTimestamp)
        const result = new Date(timestampObj.getHighBits() * 1000);
        return result;
    }

}