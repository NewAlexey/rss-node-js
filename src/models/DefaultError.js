export class DefaultError extends Error {
    constructor(message) {
        super(`Operation failed. ${message ?? ""}`);
    }
}
