let template = a => expression => expression ? expression(a) : a;

let zero = template(0);
let one = template(1);
let two = template(2);
let three = template(3);
let four = template(4);
let five = template(5);
let six = template(6);
let seven = template(7);
let eight = template(8);
let nine = template(9);

let plus = a => b => b + a;
let minus = a => b => b - a;
let times = a => b => b * a;
let dividedBy = a => b => b / a;
