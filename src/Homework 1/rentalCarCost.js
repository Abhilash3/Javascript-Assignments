const perDay = 40;
const GE = (a, b) => a >= b;
function rentalCarCost(d) {
    return d * perDay - (GE(d, 7) && 50 || GE(d, 3) && 20 || 0);
}
