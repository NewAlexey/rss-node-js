import { createHash } from "crypto";
import { createReadStream } from "fs";

import { getArgList } from "./utils.js";

export class HashService {
    commandHandler(command) {
        const [_, fileDestination] = getArgList(command);
        
        const hash = createHash("sha256");
        const stream = createReadStream(fileDestination);
        stream.on("error", () => {
            console.error("Operation failed.")
        });
        stream.on("data", (chunk) => hash.update(chunk));
        stream.on("end", () => console.log(hash.digest("hex")));
    }
}
