let op = {
    '-': (a, b) => a - b,
    '+': (a, b) => a + b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b
};
function basicOp(operation, value1, value2) {
    return op[operation](value1, value2);
}
