import { existsSync } from "fs";

export function getArgList(command) {
    return command.trim().split(" ");
}

export function checkFileExistence(fileDestination) {
    return existsSync(fileDestination);
}
