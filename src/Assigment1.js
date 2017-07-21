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
const greaterThanOrEqual7 = a => a >= 7;
const greaterThanOrEqual3 = a => a >= 3;
function rentalCarCost(d) {
  return d * perDay - (greaterThanOrEqual7(d) && 50 || greaterThanOrEqual3(d) && 20 || 0);
}
