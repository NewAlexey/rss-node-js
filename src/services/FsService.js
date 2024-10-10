import {
    createReadStream,
    lstatSync,
    readdirSync,
    writeFileSync,
    renameSync,
    rmSync,
    createWriteStream,
} from "fs";

import { checkFileExistence, getArgList } from "./utils.js";
import { DefaultError } from "../models/DefaultError.js";
import { errorCallback } from "../utils/errorCallback.js";
import { assertIfCondition } from "../utils/assertIfCondition.js";

export class FsService {
    static #commandMap = {
        ls: (args) => this.showDirectoryContentHandler(args),
        up: (args) => this.upHandler(args),
        cd: (args) => this.changeDirectoryHandler(args),
        cat: (args) => this.readFileHandler(args),
        add: (args) => this.addFileHandler(args),
        rn: (args) => this.renameFileHandler(args),
        cp: (args) => this.copyFileHandler(args),
        rm: (args) => this.removeFileHandler(args),
        mv: (args) => this.moveFileHandler(args),
    }
    
    static getCommandMap() {
        return this.#commandMap;
    }
    
    static upHandler() {
        process.chdir("..");
    }
    
    static copyFileHandler(command) {
        const [_, currentFileDestination, copiedFileDestination] = getArgList(command);
        
        assertIfCondition(!currentFileDestination, Error, "Invalid input - missing copied file path.");
        assertIfCondition(!copiedFileDestination, Error, "Invalid input - missing file destination.");
        
        const isCurrentFileExist = checkFileExistence(currentFileDestination);
        const isCopiedFileExist = checkFileExistence(copiedFileDestination);
        
        assertIfCondition(!isCurrentFileExist, DefaultError, "Copied file does not exist.");
        assertIfCondition(isCopiedFileExist, DefaultError, "File with the same name already exist.");
        
        const readStream = createReadStream(currentFileDestination);
        const writeStream = createWriteStream(copiedFileDestination);
        
        readStream.on("error", errorCallback);
        writeStream.on("error", errorCallback);
        
        readStream.on("data", (data) => {
            writeStream.write(data);
        })
    }
    
    static moveFileHandler(command) {
        const [_, currentFileDestination, movedFileDestination] = getArgList(command);
        
        assertIfCondition(!currentFileDestination, Error, "Invalid input - missing moved file path.");
        assertIfCondition(!movedFileDestination, Error, "Invalid input - missing file destination.");
        
        const isCurrentFileExist = checkFileExistence(currentFileDestination);
        const isMovedFileExist = checkFileExistence(movedFileDestination);
        
        assertIfCondition(!isCurrentFileExist, DefaultError, "Moved file does not exist.");
        assertIfCondition(isMovedFileExist, DefaultError, "File with the same name already exist.");
        
        const readStream = createReadStream(currentFileDestination);
        const writeStream = createWriteStream(movedFileDestination);
        
        readStream.on("error", errorCallback);
        writeStream.on("error", errorCallback);
        
        readStream.on("data", (data) => {
            writeStream.write(data);
        })
        readStream.on("end", () => {
            rmSync(currentFileDestination);
        })
    }
    
    static removeFileHandler(command) {
        const [_, removedFileDestination] = getArgList(command);
        
        if (!removedFileDestination) {
            throw new Error("Invalid input - missing removed file path.");
        }
        
        const isRemovedFileExist = checkFileExistence(removedFileDestination);
        
        if (!isRemovedFileExist) {
            throw new DefaultError("File does not exist.");
        }
        
        rmSync(removedFileDestination);
    }
    
    static readFileHandler(command) {
        const [_, filePath] = getArgList(command);
        
        assertIfCondition(!filePath, Error, "Invalid input - missing read file path.");
        
        const isFileExist = checkFileExistence(filePath);
        
        assertIfCondition(!isFileExist, DefaultError, "Read file does not exist.");
        
        const stream = createReadStream(filePath, "utf8");
        stream.on("error", errorCallback);
        
        stream.on("data", (chunk) => process.stdout.write(`${chunk}\n`))
    }
    
    static renameFileHandler(command) {
        const [_, renamedFileDestination, newFileName] = getArgList(command);
        
        assertIfCondition(!renamedFileDestination, Error, "Invalid input - missing renamed file path.");
        assertIfCondition(!newFileName, Error, "Invalid input - missing renamed file path.");
        
        const isRenamedFileExist = checkFileExistence(renamedFileDestination);
        const isTheSameFileExist = checkFileExistence(newFileName);
        
        assertIfCondition(!isRenamedFileExist, DefaultError, "Renamed file does not exist.");
        assertIfCondition(isTheSameFileExist, DefaultError, "File with the same name already exist.");
        
        renameSync(renamedFileDestination, newFileName);
    }
    
    static addFileHandler(command) {
        const [_, fileName] = getArgList(command);
        
        assertIfCondition(!fileName, Error, "Invalid input - missing file name.");
        
        const isFileExist = checkFileExistence(fileName);
        
        assertIfCondition(isFileExist, DefaultError, "File with the same name already exist.");
        
        writeFileSync(fileName, "");
    }
    
    static changeDirectoryHandler(command) {
        const [_, directoryPath] = getArgList(command);
        process.chdir(directoryPath);
    }
    
    static showDirectoryContentHandler() {
        const dirname = process.cwd();
        
        const directoryDataList = [];
        const fileDataList = [];
        
        readdirSync(dirname).forEach((entity) => {
            const entityDestination = `${dirname}/${entity}`;
            const isFile = lstatSync(entityDestination).isFile();
            
            const folderOrFile = {
                Name: entity,
                Type: isFile ? "file" : "directory",
            };
            
            if (isFile) {
                fileDataList.push(folderOrFile);
            } else {
                directoryDataList.push(folderOrFile);
            }
        });
        
        console.table([...directoryDataList.sort(), ...fileDataList.sort()]);
    }
}
