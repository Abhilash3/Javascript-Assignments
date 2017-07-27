function createFunctions(n) {
    return Array.from(new Array(n).keys()).map(a => () => a)
}