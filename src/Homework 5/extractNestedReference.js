Object.prototype.hash = function(string) {
    let arr = string.split('.'), obj = this, i = 0;
    while (arr.length > i && obj !== undefined) {
        obj = obj[arr[i++]];
    }
    return obj;
}
