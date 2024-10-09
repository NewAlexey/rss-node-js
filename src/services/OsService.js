import { EOL, cpus, homedir, userInfo, arch } from "os";

import { getArgList } from "./utils.js";

export class OsService {
    commandHandler(command) {
        const [_, osCommand] = getArgList(command);
        
        switch (osCommand) {
            case "--EOL": {
                console.log(`System end of line - ${JSON.stringify(EOL)}.`)
                
                break;
            }
            
            case "--cpus": {
                console.log(`CPU count - "${cpus().length}".`);
                
                break;
            }
            
            case "--homedir": {
                console.log(`System homedir - "${homedir()}".`);
                
                break;
            }
            
            case "--username": {
                console.log(`System username - "${userInfo().username}".`);
                
                break;
            }
            
            case "--architecture": {
                console.log(`System architecture - "${arch()}".`);
                
                break;
            }
            
            default: {
                console.log(`Unknown "os" command "${osCommand}", try again.`);
            }
        }
    }
}
