function countWords(str) {
    if (str.trim().length == 0) {
        return 0;
    }
    return str.replace(/\s+/g, ' ').trim().split(' ').length;
}
