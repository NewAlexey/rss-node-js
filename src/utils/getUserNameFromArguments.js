export function getUserNameFromArguments() {
    const userNameKeyPattern = new RegExp("^--username=");
    const argvList = process.argv;
    
    const userNameParameter = argvList.find((arg) => userNameKeyPattern.test(arg));
    
    if (!userNameParameter) {
        throw new Error(`Invalid input. You need to pass username as argument "--username=USER_NAME".`)
    }
    
    return userNameParameter.split("=")[1];
}
