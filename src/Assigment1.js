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
const conditionCheck = (a, b) => a(b);
const greaterThanOrEqual7 = a => conditionCheck(x => x >= 7, a);
const lessThan3 = a => conditionCheck(x => x < 3, a);
function rentalCarCost(d) {
  let cost = d * perDay;
  return greaterThanOrEqual7(d) && cost - 50 || !lessThan3(d) && cost - 20 || cost;
}