import { homedir } from "os";

import { getArgList } from "./utils.js";

export class FileManagerService {
    #userName;
    
    #exitCommandList = ["exit", ".exit"];
    
    #serviceCommandMap;
    
    constructor(userName, serviceList) {
        if (!userName) {
            throw new Error(`You need to pass username as argument '--username=USER_NAME'.`)
        }
        
        this.#userName = userName;
        this.#serviceCommandMap = serviceList.reduce((acc, service) => ({ ...acc, ...service.getCommandMap() }), {})
    }
    
    init() {
        this.startEvent();
        this.dataEvent();
        this.shutdownEvent();
    }
    
    startEvent() {
        process.chdir(homedir());
        
        console.log(`Welcome to the File Manager, ${this.#userName}!`);
        this.consoleCurrentDirectory();
    }
    
    consoleCurrentDirectory() {
        console.log(`You are currently in ${process.cwd()}\n`);
    }
    
    shutdownEvent() {
        process.on("SIGINT", () => this.closeHandler());
    }
    
    dataEvent() {
        process.stdin.on("data", (data) => {
            try {
                this.commandHandler(this.normalizeData(data));
                this.logUserActions();
            } catch (error) {
                console.error(`Operation failed. ${error?.message ?? ""}`);
            }
        });
    }
    
    logUserActions() {
        this.consoleCurrentDirectory();
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
        
        if (this.#exitCommandList.includes(command)) {
            this.closeHandler();
            
            return;
        }
        
        console.error(`Invalid input command "${command}", try again.`);
    }
    
    getServiceCommand(command) {
        return getArgList(command)[0];
    }
    
    normalizeData(data) {
        return data.toString().trim();
    }
}


