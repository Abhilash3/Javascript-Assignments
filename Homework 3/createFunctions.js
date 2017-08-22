function createFunctions(n) {
    // n size array with keys as value mapped to function returning value
    return Array.from(new Array(n).keys()).map(a => () => a)
}
