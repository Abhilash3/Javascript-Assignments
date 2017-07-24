// Printing Array elements with Comma delimiters
function printArray(arr) {
	return arr.join();
}

// Opposite number
function oppositeNumber(num) {
	return -1 * num;
}

// Basic Mathematical Operations
const op = {
	'-': (a, b) => a - b,
	'+': (a, b) => a + b,
	'*': (a, b) => a * b,
	'/': (a, b) => a / b
};
function basicOp(operation, value1, value2) {
	return op[operation](value1, value2);
}

// Transportation on vacation
const perDay = 40;
const GE = (a, b) => a >= b;
function rentalCarCost(d) {
  return d * perDay - (GE(d, 7) && 50 || GE(d, 3) && 20 || 0);
}

