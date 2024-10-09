import { FileManagerService } from "./src/services/FileManagerService.js";
import { getUserNameFromArguments } from "./src/utils/getUserNameFromArguments.js";

const userName = getUserNameFromArguments();

const fileManager = new FileManagerService(userName);
fileManager.init();
