function countWords(str) {
	str = str.replace(/\s+/g, ' ').trim();
    return str.length == 0 ? 0 : str.split(' ').length;
}
