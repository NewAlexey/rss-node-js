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

export class FsService {
    upHandler() {
        process.chdir("..");
    }
    
    copyFileHandler(command) {
        const [_, currentFileDestination, copiedFileDestination] = getArgList(command);
        
        if (!currentFileDestination || !copiedFileDestination) {
            throw new DefaultError();
        }
        
        const isCurrentFileExist = checkFileExistence(currentFileDestination);
        const isCopiedFileExist = checkFileExistence(copiedFileDestination);
        
        if (!isCurrentFileExist) {
            throw new DefaultError();
        }
        
        if (isCopiedFileExist) {
            throw new DefaultError();
        }
        
        const readStream = createReadStream(currentFileDestination);
        const writeStream = createWriteStream(copiedFileDestination);
        
        readStream.on("error", () => console.log("Operation Failed."));
        writeStream.on("error", () => console.log("Operation Failed."));
        
        readStream.on("data", (data) => {
            writeStream.write(data);
        })
    }
    
    moveFileHandler(command) {
        const [_, currentFileDestination, movedFileDestination] = getArgList(command);
        
        if (!currentFileDestination || !movedFileDestination) {
            throw new DefaultError();
        }
        
        const isCurrentFileExist = checkFileExistence(currentFileDestination);
        const isMovedFileExist = checkFileExistence(movedFileDestination);
        
        if (!isCurrentFileExist) {
            throw new DefaultError();
        }
        
        if (isMovedFileExist) {
            throw new DefaultError();
        }
        
        const readStream = createReadStream(currentFileDestination);
        const writeStream = createWriteStream(movedFileDestination);
        
        readStream.on("error", () => console.log("Operation Failed."));
        writeStream.on("error", () => console.log("Operation Failed."));
        
        readStream.on("data", (data) => {
            writeStream.write(data);
        })
        readStream.on("end", () => {
            rmSync(currentFileDestination);
        })
    }
    
    removeFileHandler(command) {
        const [_, removedFileDestination] = getArgList(command);
        
        if (!removedFileDestination) {
            throw new DefaultError();
        }
        
        const isRemovedFileExist = checkFileExistence(removedFileDestination);
        
        if (!isRemovedFileExist) {
            throw new DefaultError();
        }
        
        rmSync(removedFileDestination);
    }
    
    readFileHandler(command) {
        const [_, filePath] = getArgList(command);
        
        const isFileExist = checkFileExistence(filePath);
        
        if (!isFileExist) {
            throw new DefaultError();
        }
        
        const stream = createReadStream(filePath, "utf8");
        stream.on("data", (chunk) => process.stdout.write(`${chunk}\n`))
    }
    
    renameFileHandler(command) {
        const [_, renamedFileDestination, newFileName] = getArgList(command);
        
        if (!renamedFileDestination || !newFileName) {
            throw new DefaultError();
        }
        
        const isRenamedFileExist = checkFileExistence(renamedFileDestination);
        const isTheSameFileExist = checkFileExistence(newFileName);
        
        if (!isRenamedFileExist) {
            throw new DefaultError();
        }
        
        if (isTheSameFileExist) {
            throw new DefaultError();
        }
        
        renameSync(renamedFileDestination, newFileName);
    }
    
    addFileHandler(command) {
        const [_, fileName] = getArgList(command);
        
        const isFileExist = checkFileExistence(fileName);
        
        if (isFileExist) {
            throw new DefaultError();
        }
        
        writeFileSync(fileName, "");
    }
    
    changeDirectoryHandler(command) {
        const [_, directoryPath] = getArgList(command);
        process.chdir(directoryPath);
    }
    
    showDirectoryContentHandler() {
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
