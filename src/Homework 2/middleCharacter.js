function getMiddle(str) {
    const n = Math.floor(str.length / 2);
    return str.length % 2 && str[n] || str[n - 1].concat(str[n]);
}
