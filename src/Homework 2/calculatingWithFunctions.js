const template = a => expression => expression ? expression(a) : a;

const zero = template(0);
const one = template(1);
const two = template(2);
const three = template(3);
const four = template(4);
const five = template(5);
const six = template(6);
const seven = template(7);
const eight = template(8);
const nine = template(9);

const plus = a => b => b + a;
const minus = a => b => b - a;
const times = a => b => b * a;
const dividedBy = a => b => b / a;
