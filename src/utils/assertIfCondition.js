export const assertIfCondition = (condition, error, ...args) => {
    if (condition) {
        throw new error(args);
    }
}
