import { EOL, cpus, homedir, userInfo, arch } from "os";

import { getArgList } from "./utils.js";
import { assertIfCondition } from "../utils/assertIfCondition.js";

export class OsService {
    static #commandMap = {
        os: (args) => this.commandHandler(args),
    }
    
    static getCommandMap() {
        return this.#commandMap;
    }
    
    static commandHandler(command) {
        const [_, osCommand] = getArgList(command);
        
        assertIfCondition(!osCommand, Error, "Invalid input - missing 'os' command.");
        
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
                console.log(`System homedir - "${this.getHomeDir()}".`);
                
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
                console.log(`Invalid "os" command "${osCommand}", try again.`);
            }
        }
    }
    
    static getHomeDir() {
        return homedir();
    }
}
