export class Response {
    electionId: string;
    timestamp: Date;
    nModified: number;
    ok: number;

    constructor(electionId: string, timestamp: Date, nModified: number, ok: number) {
        this.electionId = electionId;
        this.timestamp = timestamp;
        this.nModified = nModified;
        this.ok = ok;
    }
}