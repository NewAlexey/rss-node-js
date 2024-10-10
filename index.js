import { FileManagerService } from "./src/services/FileManagerService.js";
import { getUserNameFromArguments } from "./src/utils/getUserNameFromArguments.js";
import { OsService } from "./src/services/OsService.js";
import { FsService } from "./src/services/FsService.js";
import { HashService } from "./src/services/HashService.js";
import { ZipService } from "./src/services/ZipService.js";

const userName = getUserNameFromArguments();

const fileManager = new FileManagerService(userName, [OsService, FsService, HashService, ZipService]);
fileManager.init();
