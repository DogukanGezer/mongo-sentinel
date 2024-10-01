'use strict';

import pcap from "pcap";
import bson, { BSON, Document } from "bson";
import { MsgHeader } from "./entities/MsgHeader";
import { OpMsg } from "./entities/OpMsg";
import { OpCodeValueObject } from "./valueObjects/OpCodes";
import { Request } from "./entities/Request";

export default class CapturePackets {
    private pcap_session: any;

    constructor(driver: string, filter: string) {
        this.pcap_session = pcap.createSession(driver, {
            filter: filter
        });
    }

    public async start() {
        console.log("creating pcap session...");
        this.pcap_session.on("packet", async (raw_packet: any) => {
            const ipPacet = pcap.decode.packet(raw_packet);
            const tcpPacket = ipPacet.payload.payload.payload.data

            if (!tcpPacket) { return; }
            const messageHeader: MsgHeader = await this.parseHeader(tcpPacket);
            if (!new OpCodeValueObject(messageHeader.opCode).equals(2013)) { return; }
            const bodyKind: number = await this.parseBodyKind(tcpPacket);
            if (bodyKind != 0) { return; }

            const opMSG = await this.parseOpMsg(messageHeader, tcpPacket);
            
            console.log('msg', opMSG);
        });
    }

    private async parseHeader(buffer: Buffer): Promise<MsgHeader> {
        return new MsgHeader(
            buffer.readUInt32LE(0),
            buffer.readUInt32LE(4),
            buffer.readUInt32LE(8),
            buffer.readUInt32LE(12)
        )
    }

    private async parseBodyKind(buffer: Buffer): Promise<number> {
        return buffer.readInt8(20);
    }
    private async parseOpMsg(messageHeader: MsgHeader, buffer: Buffer): Promise<OpMsg | null> {
        const flagBits = buffer.readUInt32LE(16);
        const optionalBits = flagBits >>> 16;
        const bsonSize = buffer.readInt32LE(21);
        const bsonData = buffer.slice(21, 21 + bsonSize);

        const bson = await this.parseBson(bsonData);
        const section = JSON.parse(JSON.stringify(bson));

        console.log('section', section);
        return new OpMsg(
            messageHeader,
            optionalBits,
            [section],
            0
        );

    }

    private async parseBson(buffer: Buffer): Promise<Document | null> {
        try {
            return BSON.deserialize(buffer);
        }
        catch (e: any) {
            return null
        }
    }

    private async prepareSchema(opMessage: OpMsg): Promise<Request | Response | null> {
        return null
    }

}