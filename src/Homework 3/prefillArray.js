function prefill(n, value) {
    let arr = [];
    try {
        arr.length = '' + n;
    } catch (err) {
        throw new TypeError(`${n} is invalid`);
    }
    arr.fill(value);
    return arr;
}
