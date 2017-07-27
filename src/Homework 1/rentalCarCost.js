const PER_DAY = 40;
const GE = (a, b) => a >= b; // Greater than Equals
function rentalCarCost(days) {
	//    cost for days - if days > 7 then 50 else days > 3 then 20 else 0
    return days * PER_DAY - (GE(days, 7) && 50 || GE(days, 3) && 20 || 0);
}
