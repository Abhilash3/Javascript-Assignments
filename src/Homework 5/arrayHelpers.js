Array.prototype.square = function() {
    return this.map(a => a * a);
}
Array.prototype.cube = function() {
    return this.map(a => a * a * a);
}
Array.prototype.average = function() {
    return this.reduce((a, b) => a + b, 0) / this.length;
}
Array.prototype.sum = function() {
    return this.reduce((a, b) => a + b, 0);
}
Array.prototype.even = function() {
    return this.filter(a => a % 2 == 0);
}
Array.prototype.odd = function() {
    return this.filter(a => a % 2);
}
