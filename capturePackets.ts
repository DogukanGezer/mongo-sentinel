'use strict';

import pcap from "pcap";
import { MsgHeader } from "./entities/MsgHeader";
import { OpMsg } from "./entities/OpMsg";

class CapturePackets {
    private pcap_session: any;

    constructor(driver: string, filter: string) {
        this.pcap_session = pcap.createSession(driver, {
            filter: filter
        });
    }

    public async start() {
        this.pcap_session.on("packet", async (raw_packet: any) => {
            const ipPacet = pcap.decode.packet(raw_packet);
            const tcpPacket = ipPacet.payload.payload.payload.data

            if (!tcpPacket) { return; }

            let messageHeader =
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

   
}