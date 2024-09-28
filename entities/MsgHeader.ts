export class MsgHeader {
    messageLength: number;
    requestID: number;
    responseTo: number;
    opCode: number;

    constructor(messageLength: number, requestID: number, responseTo: number, opCode: number) {
        this.messageLength = messageLength;
        this.requestID = requestID;
        this.responseTo = responseTo;
        this.opCode = opCode;
    }
}