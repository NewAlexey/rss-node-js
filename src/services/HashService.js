import { createHash } from "crypto";
import { createReadStream } from "fs";

import { getArgList } from "./utils.js";
import { assertIfCondition } from "../utils/assertIfCondition.js";
import { errorCallback } from "../utils/errorCallback.js";

export class HashService {
    static #commandMap = {
        hash: (args) => this.commandHandler(args),
    }
    
    static getCommandMap() {
        return this.#commandMap;
    }
    
    static commandHandler(command) {
        const [_, fileDestination] = getArgList(command);
        
        assertIfCondition(!fileDestination, Error, "Invalid input - missing file path.");
        
        const hash = createHash("sha256");
        const stream = createReadStream(fileDestination);
        stream.on("error", errorCallback);
        
        stream.on("data", (chunk) => hash.update(chunk));
        stream.on("end", () => console.log("File hash - ", hash.digest("hex")));
    }
}
