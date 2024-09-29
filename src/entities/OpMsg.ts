import { MsgHeader } from "./MsgHeader";

export class OpMsg {
    MsgHeader: MsgHeader;
    flagBits: number;
    sections: any[];
    optional: number;

    constructor(MsgHeader: MsgHeader, flagBits: number, sections: any[], optional: number) {
        this.MsgHeader = MsgHeader;
        this.flagBits = flagBits;
        this.sections = sections;
        this.optional = optional;
    }
}
