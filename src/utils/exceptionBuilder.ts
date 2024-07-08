export class ErrorWithStatus extends Error {
    status: number;
    name: string;

    constructor(message: string, status: number, name: string = "Error") {
        super(message)
        this.name = name;
        this.status = status
    }
}