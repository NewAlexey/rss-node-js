import { getArgList } from "./utils.js";
import { OsService } from "./OsService.js";
import { HashService } from "./HashService.js";
import { FsService } from "./FsService.js";

export class FileManagerService {
    #userName;
    
    #osService = new OsService();
    #hashService = new HashService();
    #fsService = new FsService();
    
    #serviceCommandMap = {
        os: (args) => this.#osService.commandHandler(args),
        hash: (args) => this.#hashService.commandHandler(args),
        ls: (args) => this.#fsService.showDirectoryContentHandler(args),
        up: (args) => this.#fsService.upHandler(args),
        cd: (args) => this.#fsService.changeDirectoryHandler(args),
        cat: (args) => this.#fsService.readFileHandler(args),
        add: (args) => this.#fsService.addFileHandler(args),
        rn: (args) => this.#fsService.renameFileHandler(args),
        cp: (args) => this.#fsService.copyFileHandler(args),
        rm: (args) => this.#fsService.removeFileHandler(args),
        mv: (args) => this.#fsService.moveFileHandler(args),
    }
    
    
    constructor(userName) {
        if (!userName) {
            throw new Error(`You need to pass username as argument '--username=USER_NAME'.`)
        }
        
        this.#userName = userName;
    }
    
    init() {
        this.startEvent();
        this.dataEvent();
        this.shutdownEvent();
    }
    
    startEvent() {
        console.log(`Welcome to the File Manager, ${this.#userName}!`);
    }
    
    shutdownEvent() {
        process.on("SIGINT", () => this.closeHandler());
    }
    
    dataEvent() {
        process.stdin.on("data", (data) => {
            try {
                this.commandHandler(this.normalizeData(data));
            } catch (error) {
                console.error(error?.message ?? "Operation failed.");
            }
        });
    }
    
    closeHandler() {
        console.log(`\nThank you for using File Manager, ${this.#userName}, goodbye!`)
        process.exit();
    }
    
    commandHandler(command) {
        const serviceCommand = this.getServiceCommand(command);
        const serviceHandler = this.#serviceCommandMap[serviceCommand];
        
        if (serviceHandler) {
            serviceHandler(command);
            
            return;
        }
        
        
        switch (command) {
            case "exit":
            case ".exit": {
                this.closeHandler();
                
                break;
            }
            
            default: {
                console.log(`Unknown command "${command}", try again.`);
            }
        }
    }
    
    getServiceCommand(command) {
        const argList = getArgList(command);
        
        return argList[0];
    }
    
    normalizeData(data) {
        return data.toString().trim();
    }
}


