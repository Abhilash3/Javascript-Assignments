function getMiddle(str) {
    const n = str.length;
    return n % 2 && str[(n - 1) / 2] || [str[n / 2 - 1], str[n / 2]].join('');
}
