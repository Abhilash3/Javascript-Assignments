const defaultBehavior = (a, expression) => expression && expression(a) || a;
const defaultScope = null;

const zero = defaultBehavior.bind(defaultScope, 0);
const one = defaultBehavior.bind(defaultScope, 1);
const two = defaultBehavior.bind(defaultScope, 2);
const three = defaultBehavior.bind(defaultScope, 3);
const four = defaultBehavior.bind(defaultScope, 4);
const five = defaultBehavior.bind(defaultScope, 5);
const six = defaultBehavior.bind(defaultScope, 6);
const seven = defaultBehavior.bind(defaultScope, 7);
const eight = defaultBehavior.bind(defaultScope, 8);
const nine = defaultBehavior.bind(defaultScope, 9);

const plus = (a) => ((b) => b + a);
const minus = (a) => ((b) => b - a);
const times = (a) => ((b) => b * a);
const dividedBy = (a) => ((b) => b / a);
