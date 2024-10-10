import { createReadStream, createWriteStream } from "fs";
import { createBrotliCompress, createBrotliDecompress } from "zlib";

import { checkFileExistence, getArgList } from "./utils.js";
import { assertIfCondition } from "../utils/assertIfCondition.js";
import { DefaultError } from "../models/DefaultError.js";
import { errorCallback } from "../utils/errorCallback.js";

export class ZipService {
    static #commandMap = {
        compress: (args) => this.compress(args),
        decompress: (args) => this.decompress(args),
    }
    
    static getCommandMap() {
        return this.#commandMap;
    }
    
    static compress(command) {
        const [_, compressFilePath, destinationPath] = getArgList(command);
        
        assertIfCondition(!compressFilePath, Error, "Invalid input - missing compress file path.");
        assertIfCondition(!destinationPath, Error, "Invalid input - missing file destination path.");
        
        const isCompressedFileExist = checkFileExistence(compressFilePath);
        const isOutputFileExist = checkFileExistence(destinationPath);
        
        assertIfCondition(!isCompressedFileExist, DefaultError, "Compressed file does not exist.");
        assertIfCondition(isOutputFileExist, DefaultError, "File with the same name already exist.");
        
        const brotli = createBrotliCompress();
        const readStream = createReadStream(compressFilePath);
        const writeStream = createWriteStream(destinationPath);
        
        brotli.on("error", errorCallback);
        readStream.on("error", errorCallback);
        writeStream.on("error", errorCallback);
        
        readStream.pipe(brotli).pipe(writeStream);
    }
    
    static decompress(command) {
        const [_, decompressFilePath, destinationPath] = getArgList(command);
        
        assertIfCondition(!decompressFilePath, Error, "Invalid input - missing decompress file path.");
        assertIfCondition(!destinationPath, Error, "Invalid input - missing file destination path.");
        
        const isDecompressedFileExist = checkFileExistence(decompressFilePath);
        const isOutputFileExist = checkFileExistence(destinationPath);
        
        assertIfCondition(!isDecompressedFileExist, DefaultError, "Decompressed file does not exist.");
        assertIfCondition(isOutputFileExist, DefaultError, "File with the same name already exist.");
        
        const brotli = createBrotliDecompress();
        const readStream = createReadStream(decompressFilePath);
        const writeStream = createWriteStream(destinationPath);
        
        brotli.on("error", errorCallback);
        readStream.on("error", errorCallback);
        writeStream.on("error", errorCallback);
        
        readStream.pipe(brotli).pipe(writeStream);
    }
}
